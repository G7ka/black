import { platformConfigRepository } from '../repositories/platformConfig.repository.js';
import { invoiceRepository } from '../repositories/invoice.repository.js';
import { schoolRepository } from '../repositories/school.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { currentPeriod, dueDateForPeriod } from '../utils/billingPeriod.js';

// Remove price limits - allow any price from 0 upwards
const MIN_PRICE = 0;
const MAX_PRICE = 1000000; // Set a reasonable upper limit (1 million UGX per student)
const DEFAULT_PRICE = 0;

export const billingService = {
  async getPricePerStudent() {
    const row = await platformConfigRepository.get('billing');
    return row?.value?.pricePerStudent ?? DEFAULT_PRICE;
  },

  async setPricePerStudent(rawPrice) {
    // Validate the price is a non-negative number
    const price = Number(rawPrice);
    if (isNaN(price)) {
      throw ApiError.badRequest('Price must be a valid number');
    }
    if (price < 0) {
      throw ApiError.badRequest('Price cannot be negative');
    }
    if (price > MAX_PRICE) {
      throw ApiError.badRequest(`Price cannot exceed UGX ${MAX_PRICE}`);
    }
    
    // Store the exact price - no clamping
    await platformConfigRepository.upsert('billing', { pricePerStudent: price });
    return price;
  },

  // Ensures every active school has an invoice for the current billing
  // period. Missing invoices are created in a single batched insert
  // (not one query per school) — a scheduled job replaces this lazy
  // generation entirely in Phase 8 production readiness.
  async listSchoolsWithBilling() {
    const period = currentPeriod();
    const pricePerStudent = await this.getPricePerStudent();
    const schools = await invoiceRepository.listActiveSchoolsWithCurrentInvoice(period);

    const due = dueDateForPeriod(period);
    const status = due < new Date() ? 'OVERDUE' : 'PENDING';
    const missing = schools.filter((s) => s.invoices.length === 0);

    if (missing.length > 0) {
      await invoiceRepository.createMany(
        missing.map((school) => ({
          schoolId: school.id,
          period,
          amount: school.numStudentsDeclared * pricePerStudent,
          dueDate: due,
          status,
        }))
      );
    }

    // Single re-fetch picks up both pre-existing and just-created invoices —
    // still one round trip total, not one per missing school.
    const invoices = missing.length > 0
      ? await invoiceRepository.findManyBySchoolAndPeriod(missing.map((s) => s.id), period)
      : [];
    const invoiceBySchoolId = new Map(invoices.map((inv) => [inv.schoolId, inv]));

    const results = schools.map((school) => {
      const invoice = school.invoices[0] || invoiceBySchoolId.get(school.id);
      return {
        schoolId: school.id,
        schoolName: school.name,
        level: school.level,
        students: school.numStudentsDeclared,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        status: invoice.status,
        invoiceId: invoice.id,
      };
    });

    const summary = {
      pricePerStudent,
      totalActiveStudents: schools.reduce((sum, s) => sum + s.numStudentsDeclared, 0),
      monthlyRevenue: results.reduce((sum, r) => sum + r.amount, 0),
      overdueCount: results.filter((r) => r.status === 'OVERDUE').length,
      totalSchools: schools.length,
    };

    return { schools: results, summary };
  },

  async sendReminder(schoolId) {
    const school = await schoolRepository.findById(schoolId);
    if (!school) throw ApiError.notFound('School not found');

    const period = currentPeriod();
    const invoice = await invoiceRepository.findBySchoolAndPeriod(schoolId, period);
    if (!invoice) throw ApiError.notFound('No invoice found for the current period');

    await enqueueEmail({
      type: 'SCHOOL_ADMIN_NOTIFICATION',
      to: school.contactEmail,
      params: {
        schoolName: school.name,
        messageType: 'warning',
        message: `Your invoice of UGX ${invoice.amount.toLocaleString()} for ${period} is due on ${invoice.dueDate.toDateString()}. Please process payment to avoid service suspension.`,
      },
    });

    return { sent: true };
  },
};