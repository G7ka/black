import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { env } from '../config/env.js';

export async function hashPassword(plain) {
  return bcrypt.hash(plain, env.bcryptSaltRounds);
}

export async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// 6-digit numeric reset code, stored hashed (never store raw codes).
export function generateResetCode() {
  const code = String(crypto.randomInt(100000, 999999));
  return code;
}

export function hashResetCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}
