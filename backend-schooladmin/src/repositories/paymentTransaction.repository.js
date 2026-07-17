import { prisma } from '../config/prisma.js';

export const paymentTransactionRepository = {
  create(data) {
    return prisma.paymentTransaction.create({ data });
  },
  findByMerchantReference(merchantReference) {
    return prisma.paymentTransaction.findUnique({ where: { merchantReference } });
  },
  findByOrderTrackingId(orderTrackingId) {
    return prisma.paymentTransaction.findUnique({ where: { orderTrackingId } });
  },
  findById(id) {
    return prisma.paymentTransaction.findUnique({ where: { id }, include: { invoice: true } });
  },
  attachOrderTrackingId(id, orderTrackingId, redirectUrl, rawSubmitResponse) {
    return prisma.paymentTransaction.update({
      where: { id },
      data: { orderTrackingId, redirectUrl, rawSubmitResponse },
    });
  },
  updateFromStatus(id, data) {
    return prisma.paymentTransaction.update({ where: { id }, data });
  },
  listForInvoice(invoiceId) {
    return prisma.paymentTransaction.findMany({ where: { invoiceId }, orderBy: { createdAt: 'desc' } });
  },
  // Latest attempt for a school, regardless of invoice — used to show
  // "pending payment in progress" state in the admin UI.
  findLatestForSchool(schoolId) {
    return prisma.paymentTransaction.findFirst({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
