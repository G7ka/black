export function toApiKeyDTO(key) {
  return {
    id: key.id,
    name: key.name,
    keyPrefix: key.keyPrefix,
    status: key.status,
    lastUsedAt: key.lastUsedAt,
    createdAt: key.createdAt,
  };
}
