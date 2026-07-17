import { pesapalClient } from './pesapalClient.service.js';
import { pesapalConfig } from '../../config/pesapal.js';
import { platformConfigRepository } from '../../repositories/platformConfig.repository.js';

/**
 * The IPN URL must be registered with Pesapal before SubmitOrderRequest
 * can be called (notification_id is a required field on that call). This
 * ensures registration happens once and is reused — re-registering on
 * every payment would create duplicate IPN records on Pesapal's side.
 */
export const pesapalIpnSetupService = {
  async getOrRegisterIpnId() {
    const cached = await platformConfigRepository.get('pesapal');
    if (cached?.value?.ipnId && cached.value.ipnUrl === pesapalConfig.ipnUrl) {
      return cached.value.ipnId;
    }

    // Check Pesapal's own record before registering again — avoids
    // accumulating duplicate IPN registrations if our local cache was
    // cleared but Pesapal already has this URL registered.
    const existing = await pesapalClient.getIpnList();
    const match = Array.isArray(existing)
      ? existing.find((ipn) => ipn.url === pesapalConfig.ipnUrl)
      : null;

    const ipnId = match
      ? match.ipn_id
      : (await pesapalClient.registerIpn({ url: pesapalConfig.ipnUrl, notificationType: 'GET' })).ipn_id;

    await platformConfigRepository.upsert('pesapal', {
      ipnId,
      ipnUrl: pesapalConfig.ipnUrl,
      registeredAt: new Date().toISOString(),
    });

    return ipnId;
  },
};
