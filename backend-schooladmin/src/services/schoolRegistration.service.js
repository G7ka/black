import { schoolRepository } from '../repositories/school.repository.js';
import { platformAdminRepository } from '../repositories/platformAdmin.repository.js';
import { hashPassword } from '../utils/password.js';
import { ApiError } from '../utils/ApiError.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { billingService } from './billing.service.js';

const RESERVED_SUBDOMAINS = ['admin', 'api', 'www', 'app', 'mail', 'support'];

export const schoolRegistrationService = {
  async checkSubdomainAvailability(subdomain) {
    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      return { available: false, reason: 'reserved' };
    }
    const taken = await schoolRepository.isSubdomainTaken(subdomain);
    return { available: !taken, reason: taken ? 'taken' : null };
  },

  async getPricePerStudent() {
    return billingService.getPricePerStudent();
  },

  async searchSchools(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return schoolRepository.searchPublicSchools(query.trim());
  },

  // Mirrors SchoolRegistration.jsx steps 1-4 into a single atomic operation:
  // creates the School (status=PENDING) + first SCHOOLADMIN user together.
  async register(payload, licenseFileUrl) {
    const {
      schoolName, level, physicalAddress, district, numStudents,
      contactName, contactPhone, contactEmail, schoolWebsite,
      subdomain, adminUsername, adminPassword, recoveryEmail,
    } = payload;

    const { available } = await this.checkSubdomainAvailability(subdomain);
    if (!available) throw ApiError.conflict('Subdomain is not available');

    const adminRole = level === 'primary' ? 'SCHOOLADMIN_PRIMARY' : 'SCHOOLADMIN_SECONDARY';
    const passwordHash = await hashPassword(adminPassword);

    const { school, admin } = await schoolRepository.createWithAdmin({
      schoolData: {
        name: schoolName,
        level: level.toUpperCase(),
        subdomain,
        physicalAddress,
        district,
        contactName,
        contactPhone,
        contactEmail,
        website: schoolWebsite || null,
        numStudentsDeclared: numStudents,
        licenseFileUrl: licenseFileUrl || null,
        status: 'PENDING',
      },
      adminData: {
        role: adminRole,
        fullName: contactName,
        username: adminUsername,
        recoveryEmail,
        passwordHash,
        status: 'PENDING', // activated once platform approves the school
      },
    });

    await enqueueEmail({
      type: 'SCHOOL_REGISTRATION_RECEIVED',
      to: contactEmail,
      params: { contactName, schoolName, subdomain },
    });

    const superAdmins = await platformAdminRepository.findActiveSuperAdmins();
    await Promise.all(
      superAdmins.map((sa) =>
        enqueueEmail({
          type: 'PLATFORM_ADMIN_NOTIFICATION',
          to: sa.email,
          params: {
            title: 'New School Application',
            message: `${schoolName} (${district}) submitted a registration application requesting subdomain "${subdomain}". Review it in Schools Management.`,
          },
        })
      )
    );

    return { school, admin };
  },
};
