import { schoolRepository } from '../../repositories/school.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { prisma } from '../../config/prisma.js';
import { invoiceRepository } from '../../repositories/invoice.repository.js';
import { billingService } from '../billing.service.js';
import { currentPeriod } from '../../utils/billingPeriod.js';

export const schoolConfigService = {
  async get(schoolId) {
    const school = await schoolRepository.findById(schoolId);
    if (!school) throw ApiError.notFound('School not found');
    return {
      name: school.name,
      motto: school.motto,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone,
      currentTerm: school.currentTerm,
      termStart: school.termStart,
      termEnd: school.termEnd,
      notificationSettings: school.notificationSettings || {
        smsNotif: true,
        emailNotif: true,
        attendanceAlert: true,
        feeReminder: true,
      },
    };
  },

  updateSchoolInfo(schoolId, { name, motto, contactEmail, contactPhone }) {
    return prisma.school.update({ where: { id: schoolId }, data: { name, motto, contactEmail, contactPhone } });
  },

  updateTerms(schoolId, { currentTerm, termStart, termEnd }) {
    return prisma.school.update({
      where: { id: schoolId },
      data: {
        currentTerm,
        termStart: termStart ? new Date(termStart) : null,
        termEnd: termEnd ? new Date(termEnd) : null,
      },
    });
  },

  updateNotificationSettings(schoolId, settings) {
    return prisma.school.update({ where: { id: schoolId }, data: { notificationSettings: settings } });
  },

  // Backs the Configuration "Billing" tab — this is the SCHOOL's own
  // subscription bill to the platform (the Invoice/PaymentTransaction
  // models from the Pesapal integration), not the internal parent-fee
  // ledger. Real data only — no "auto-debit enabled" fabrication.
  async getBillingStatus(schoolId) {
    const school = await schoolRepository.findById(schoolId);
    if (!school) throw ApiError.notFound('School not found');

    const period = currentPeriod();
    const pricePerStudent = await billingService.getPricePerStudent();
    const invoice = await invoiceRepository.findBySchoolAndPeriod(schoolId, period);

    return {
      enrolledStudents: school.numStudentsDeclared,
      pricePerStudent,
      currentPeriod: period,
      invoice: invoice
        ? { amount: invoice.amount, dueDate: invoice.dueDate, status: invoice.status, paidAt: invoice.paidAt }
        : null,
    };
  },
};
