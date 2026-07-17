import crypto from 'crypto';
import { feesRepository } from '../../repositories/fees.repository.js';
import { studentRepository } from '../../repositories/student.repository.js';
import { schoolRepository } from '../../repositories/school.repository.js';
import { enqueueEmail } from '../../emails/emailQueue.js';
import { ApiError } from '../../utils/ApiError.js';

function computeStatus(expected, paid) {
  if (paid >= expected && expected > 0) return 'PAID';
  if (paid > 0) return 'PARTIAL';
  return 'OVERDUE';
}

export const feesService = {
  listStructures: (schoolId) => feesRepository.findAllStructuresForSchool(schoolId),

  saveStructure: (schoolId, { classId, term, tuition, lunch, activities }) =>
    feesRepository.upsertStructure({ schoolId, classId, term, tuition, lunch, activities }),

  // Real per-student payment status, computed from the actual payment
  // ledger against the class fee structure — not mock "paid/partial/overdue" labels.
  async listPaymentStatus(schoolId, term) {
    const [structures, students] = await Promise.all([
      feesRepository.findAllStructuresForSchool(schoolId),
      studentRepository.findAllForSchool(schoolId, {}),
    ]);

    const structureByClass = Object.fromEntries(structures.map((s) => [s.classId, s]));

    const rows = [];
    for (const student of students) {
      const structure = structureByClass[student.classId];
      const expected = structure ? structure.tuition + structure.lunch + structure.activities : 0;
      const paid = await feesRepository.sumPaidForStudent(student.id, term);
      rows.push({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        className: student.class?.name,
        parent: student.parents[0]?.parent?.fullName || '—',
        expected,
        paid,
        balance: Math.max(0, expected - paid),
        status: computeStatus(expected, paid),
      });
    }
    return rows;
  },

  async recordPayment(schoolId, { studentId, term, amount, method, recordedByUserId }) {
    const student = await studentRepository.findByIdForSchool(schoolId, studentId);
    if (!student) throw ApiError.notFound('Student not found');

    return feesRepository.recordPayment({
      schoolId,
      studentId,
      term,
      amount,
      method,
      recordedByUserId,
      receiptNumber: `RCT-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
    });
  },

  async sendReminder(schoolId, studentId, term) {
    const student = await studentRepository.findByIdForSchool(schoolId, studentId);
    if (!student) throw ApiError.notFound('Student not found');

    const full = await studentRepository.findById(studentId);
    const parentEmail = full.parents[0]?.parent?.email;
    if (!parentEmail) throw ApiError.conflict('This student has no parent email on file');

    const structure = await feesRepository.findStructureForClass(student.classId);
    const expected = structure ? structure.tuition + structure.lunch + structure.activities : 0;
    const paid = await feesRepository.sumPaidForStudent(studentId, term);
    const school = await schoolRepository.findById(schoolId);

    await enqueueEmail({
      type: 'SCHOOL_ADMIN_NOTIFICATION',
      to: parentEmail,
      params: {
        schoolName: school.name,
        messageType: 'warning',
        message: `Fee balance for ${student.firstName} ${student.lastName} (${term}): UGX ${(expected - paid).toLocaleString()} outstanding. Please settle at your earliest convenience.`,
      },
    });

    return { sent: true };
  },
};
