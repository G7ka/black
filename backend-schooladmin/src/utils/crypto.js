import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGO = 'aes-256-gcm';

function getKeyBuffer() {
  const key = Buffer.from(env.encryptionKey, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }
  return key;
}

export function encryptSecret(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKeyBuffer(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
}

export function decryptSecret(payload) {
  const [ivHex, authTagHex, dataHex] = payload.split(':');
  const decipher = crypto.createDecipheriv(ALGO, getKeyBuffer(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
}

// Masks a secret for display, e.g. "sk_live_****************ab12"
export function maskSecret(plainText) {
  if (!plainText || plainText.length < 8) return '••••••••';
  return `${plainText.slice(0, 4)}${'•'.repeat(12)}${plainText.slice(-4)}`;
}
