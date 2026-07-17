export function toPaymentTransactionDTO(tx) {
  return {
    id: tx.id,
    invoiceId: tx.invoiceId,
    schoolId: tx.schoolId,
    merchantReference: tx.merchantReference,
    orderTrackingId: tx.orderTrackingId,
    currency: tx.currency,
    amount: tx.amount,
    status: tx.status,
    paymentMethod: tx.paymentMethod,
    confirmationCode: tx.confirmationCode,
    paymentAccount: tx.paymentAccount,
    refundStatus: tx.refundStatus,
    initiatedAt: tx.initiatedAt,
    completedAt: tx.completedAt,
    cancelledAt: tx.cancelledAt,
  };
}
