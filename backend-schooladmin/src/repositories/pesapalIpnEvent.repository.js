import { prisma } from '../config/prisma.js';

export const pesapalIpnEventRepository = {
  record({ paymentTransactionId, orderTrackingId, orderMerchantReference, orderNotificationType, rawPayload }) {
    return prisma.pesapalIpnEvent.create({
      data: { paymentTransactionId, orderTrackingId, orderMerchantReference, orderNotificationType, rawPayload },
    });
  },
  markProcessed(id, responseStatusSent) {
    return prisma.pesapalIpnEvent.update({
      where: { id },
      data: { processingStatus: 'PROCESSED', responseStatusSent, processedAt: new Date() },
    });
  },
  markFailed(id, errorMessage, responseStatusSent = 500) {
    return prisma.pesapalIpnEvent.update({
      where: { id },
      data: { processingStatus: 'FAILED', errorMessage, responseStatusSent, processedAt: new Date() },
    });
  },
  countForOrderTrackingId(orderTrackingId) {
    return prisma.pesapalIpnEvent.count({ where: { orderTrackingId } });
  },
};
