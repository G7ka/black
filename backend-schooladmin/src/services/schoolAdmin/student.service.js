import { studentRepository } from '../../repositories/student.repository.js';
import { parentRepository } from '../../repositories/parent.repository.js';
import { schoolClassRepository } from '../../repositories/schoolClass.repository.js';
import { ApiError } from '../../utils/ApiError.js';

async function generateStudentCode(schoolId) {
  const year = new Date().getFullYear();
  const prefix = `STU-${year}-`;
  const count = await studentRepository.countCodesLike(schoolId, prefix);
  return `${prefix}${String(count + 1).padStart(4, '0')}`;
}

export const studentService = {
  list: (schoolId, opts) => studentRepository.findAllForSchool(schoolId, opts),

  async getById(schoolId, id) {
    const student = await studentRepository.findByIdForSchool(schoolId, id);
    if (!student) throw ApiError.notFound('Student not found');
    return studentRepository.findById(id);
  },

  async enroll(schoolId, payload) {
    const { firstName, lastName, dateOfBirth, gender, classId, streamId, parentName, parentPhone, parentEmail } = payload;

    const cls = await schoolClassRepository.findByIdForSchool(schoolId, classId);
    if (!cls) throw ApiError.notFound('Class not found');

    const studentCode = await generateStudentCode(schoolId);

    const student = await studentRepository.create({
      schoolId,
      studentCode,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      classId,
      streamId: streamId || null,
      status: 'ACTIVE',
    });

    if (parentName && (parentPhone || parentEmail)) {
      let parent = parentEmail ? await parentRepository.findByEmailInSchool(schoolId, parentEmail) : null;
      if (!parent) {
        parent = await parentRepository.create({
          schoolId,
          fullName: parentName,
          phone: parentPhone || '',
          email: parentEmail || null,
          status: 'ACTIVE',
        });
      }
      await studentRepository.linkParent(student.id, parent.id);
    }

    return studentRepository.findById(student.id);
  },

  async relocate(schoolId, id, { targetClassId, targetStreamId, reason }) {
    await this.getById(schoolId, id);
    const targetClass = await schoolClassRepository.findByIdForSchool(schoolId, targetClassId);
    if (!targetClass) throw ApiError.notFound('Target class not found');
    return studentRepository.update(id, { classId: targetClassId, streamId: targetStreamId || null });
  },

  async promote(schoolId, id) {
    const student = await this.getById(schoolId, id);
    const nextClass = await schoolClassRepository.findNextClass(schoolId, student.class.order);
    if (!nextClass) {
      return studentRepository.update(id, { status: 'GRADUATED' });
    }
    return studentRepository.update(id, { classId: nextClass.id, streamId: null, status: 'ACTIVE' });
  },

  async markRepeating(schoolId, id, reason) {
    await this.getById(schoolId, id);
    return studentRepository.update(id, { status: 'REPEATING' });
  },

  // Bulk promotion by explicit per-student decision list — the frontend's
  // "auto-promote by score threshold" needs a Grades module (not built
  // yet) to know real scores, so this takes an explicit decision list
  // computed client-side or by a future Grades service, rather than
  // fabricating a pass/fail threshold against data we don't have.
  async bulkPromote(schoolId, decisions) {
    const results = [];
    for (const { studentId, action } of decisions) {
      if (action === 'promote') results.push(await this.promote(schoolId, studentId));
      else if (action === 'repeat') results.push(await this.markRepeating(schoolId, studentId));
    }
    return results;
  },
};
