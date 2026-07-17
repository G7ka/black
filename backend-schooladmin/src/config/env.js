import 'dotenv/config';

function required(key, fallback) {
  const val = process.env[key] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return val;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  databaseUrl: required('DATABASE_URL'),
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    mainDomain: process.env.CORS_MAIN_DOMAIN || 'edumanage.ug',
    devOrigin: process.env.CORS_DEV_ORIGIN || 'http://lvh.me:5173',
  },
  resetCodeExpiresMin: Number(process.env.RESET_CODE_EXPIRES_MIN || 15),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  encryptionKey: required('ENCRYPTION_KEY'), // 32-byte hex/base64 key for AES-256-GCM
  slowQueryThresholdMs: Number(process.env.SLOW_QUERY_THRESHOLD_MS || 200),
  mail: {
    mailer: process.env.MAIL_MAILER || 'smtp',
    host: required('MAIL_HOST'),
    port: Number(process.env.MAIL_PORT || 465),
    username: required('MAIL_USERNAME'),
    password: required('MAIL_PASSWORD'),
    encryption: process.env.MAIL_ENCRYPTION || 'ssl', // 'ssl' | 'tls' | 'none'
    fromAddress: required('MAIL_FROM_ADDRESS'),
    fromName: process.env.MAIL_FROM_NAME || 'EduManage',
  },
  pesapal: {
    env: process.env.PESAPAL_ENV || 'sandbox', // 'sandbox' | 'live'
    consumerKey: required('PESAPAL_CONSUMER_KEY'),
    consumerSecret: required('PESAPAL_CONSUMER_SECRET'),
    // Publicly reachable URLs — Pesapal calls these directly, no auth possible.
    ipnUrl: required('PESAPAL_IPN_URL'), // e.g. https://api.edumanage.ug/api/v1/payments/pesapal/ipn
    callbackUrl: required('PESAPAL_CALLBACK_URL'), // e.g. https://edumanage.ug/payment/callback
  },
};
