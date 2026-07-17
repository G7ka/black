import { prisma } from '../../config/prisma.js';
import { schoolAlertRepository } from '../../repositories/schoolAlert.repository.js';
import { schoolRepository } from '../../repositories/school.repository.js';
import { enqueueEmail } from '../../emails/emailQueue.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * Resolves an audience label to a list of recipient emails. SMS/App
 * channels are recorded (for history/audit) but actually delivered via
 * email — there's no SMS gateway (Africa's Talking) or push
 * infrastructure wired up yet, and pretending to send an SMS would
 * violate the no-fabrication principle used throughout this project.
 * The UI should be honest that only email is truly dispatched today.
 */
async function resolveAudienceEmails(schoolId, audience) {
  if (audience === 'All Parents') {
    const parents = await prisma.parent.findMany({ where: { schoolId, status: 'ACTIVE', email: { not: null } } });
    return parents.map((p) => p.email);
  }
  if (audience === 'All Teachers') {
    const teachers = await prisma.teacherProfile.findMany({ where: { schoolId, status: 'ACTIVE' }, include: { user: true } });
    return teachers.map((t) => t.user.email).filter(Boolean);
  }
  if (audience.startsWith('Class:')) {
    const className = audience.replace('Class:', '');
    const cls = await prisma.schoolClass.findFirst({ where: { schoolId, name: className } });
    if (!cls) return [];
    const students = await prisma.student.findMany({
      where: { classId: cls.id },
      include: { parents: { include: { parent: true } } },
    });
    const emails = students.flatMap((s) => s.parents.map((sp) => sp.parent.email).filter(Boolean));
    return [...new Set(emails)];
  }
  // 'All Students' has no direct login/email path yet (students aren't
  // required to have accounts) — falls back to their parents' emails.
  if (audience === 'All Students' || audience === 'EMERGENCY: ALL USERS') {
    const parents = await prisma.parent.findMany({ where: { schoolId, status: 'ACTIVE', email: { not: null } } });
    return parents.map((p) => p.email);
  }
  return [];
}

export const schoolAlertService = {
  list: (schoolId) => schoolAlertRepository.listForSchool(schoolId),

  async send(schoolId, { sentByUserId, channel, audience, message }) {
    if (!message?.trim()) throw ApiError.badRequest('Message is required');

    const school = await schoolRepository.findById(schoolId);
    const recipients = await resolveAudienceEmails(schoolId, audience);

    await Promise.all(
      recipients.map((to) =>
        enqueueEmail({
          type: 'SCHOOL_ADMIN_NOTIFICATION',
          to,
          params: {
            schoolName: school.name,
            messageType: channel === 'EMERGENCY' ? 'urgent' : 'info',
            message,
          },
        })
      )
    );

    return schoolAlertRepository.create({
      schoolId,
      sentByUserId,
      channel,
      audience,
      message,
      recipientCount: recipients.length,
    });
  },
};
