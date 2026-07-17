import { prisma } from '../config/prisma.js';
import { schoolRepository } from '../repositories/school.repository.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { ApiError } from '../utils/ApiError.js';

export const notificationService = {
  async sendToSchool({ schoolId, messageType, message }) {
    if (schoolId === 'all') {
      const schools = await prisma.school.findMany({
        where: { status: 'ACTIVE' },
        select: { contactEmail: true, name: true },
      });
      await Promise.all(
        schools.map((s) =>
          enqueueEmail({
            type: 'SCHOOL_ADMIN_NOTIFICATION',
            to: s.contactEmail,
            params: { schoolName: s.name, messageType, message },
          })
        )
      );
      return { sentTo: schools.length };
    }

    const school = await schoolRepository.findById(schoolId);
    if (!school) throw ApiError.notFound('School not found');

    await enqueueEmail({
      type: 'SCHOOL_ADMIN_NOTIFICATION',
      to: school.contactEmail,
      params: { schoolName: school.name, messageType, message },
    });
    return { sentTo: 1 };
  },
};
