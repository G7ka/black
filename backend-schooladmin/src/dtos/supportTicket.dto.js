export function toTicketDTO(ticket) {
  return {
    id: ticket.id,
    displayId: `TK-${ticket.id.slice(0, 4).toUpperCase()}`,
    school: ticket.school?.name,
    subject: ticket.subject,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    replies: ticket.replies?.map((r) => ({
      id: r.id,
      authorType: r.authorType,
      authorId: r.authorId,
      body: r.body,
      createdAt: r.createdAt,
    })),
  };
}
