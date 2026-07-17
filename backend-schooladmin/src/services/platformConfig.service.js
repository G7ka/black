import { platformConfigRepository } from '../repositories/platformConfig.repository.js';
import { encryptSecret, decryptSecret, maskSecret } from '../utils/crypto.js';

const DEFAULTS = {
  appearance: { darkMode: false },
  branding: {
    platformName: 'EduManage Uganda',
    supportEmail: 'support@edumanage.ug',
    primaryColor: '#2563eb',
    logoUrl: null,
    emailFooter: `© ${new Date().getFullYear()} EduManage Uganda. All rights reserved.`,
  },
  features: {
    sms: true,
    email: true,
    biometric: false,
    momo: true,
    airtel: true,
    s3: true,
    twoFactor: false,
    api: false,
  },
  security: {
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    ipWhitelist: [],
    enforce2faForAdmins: false,
  },
};

const INTEGRATION_KEYS = [
  'africasTalkingApiKey',
  'mtnMomoPrimaryKey',
  'airtelMoneyApiKey',
  'sendgridApiKey',
  'awsAccessKeyId',
  'awsSecretAccessKey',
  'awsS3BucketName',
];

async function getSection(key, fallback) {
  const row = await platformConfigRepository.get(key);
  return row ? { ...fallback, ...row.value } : fallback;
}

export const platformConfigService = {
  getAppearance: () => getSection('appearance', DEFAULTS.appearance),
  getBranding: () => getSection('branding', DEFAULTS.branding),
  getFeatures: () => getSection('features', DEFAULTS.features),
  getSecurity: () => getSection('security', DEFAULTS.security),

  setAppearance: (value) => platformConfigRepository.upsert('appearance', value),
  setBranding: (value) => platformConfigRepository.upsert('branding', value),
  setFeatures: (value) => platformConfigRepository.upsert('features', value),
  setSecurity: (value) => platformConfigRepository.upsert('security', value),

  // Integration secrets are stored encrypted (AES-256-GCM) and only ever
  // returned to the client masked — never decrypted for display.
  async getIntegrationsMasked() {
    const row = await platformConfigRepository.get('integrations');
    const stored = row?.value || {};
    const masked = {};
    for (const k of INTEGRATION_KEYS) {
      masked[k] = stored[k] ? maskSecret(decryptSecret(stored[k])) : null;
    }
    return masked;
  },

  async setIntegrations(partialPlainValues) {
    const row = await platformConfigRepository.get('integrations');
    const stored = row?.value || {};
    for (const [k, v] of Object.entries(partialPlainValues)) {
      if (!INTEGRATION_KEYS.includes(k)) continue;
      if (v) stored[k] = encryptSecret(v);
    }
    await platformConfigRepository.upsert('integrations', stored);
    return this.getIntegrationsMasked();
  },

  // Internal accessor for other services that need the real secret
  // (e.g. an SMS service reading africasTalkingApiKey). Never exposed
  // over HTTP.
  async getIntegrationSecret(key) {
    const row = await platformConfigRepository.get('integrations');
    const stored = row?.value?.[key];
    return stored ? decryptSecret(stored) : null;
  },
};
