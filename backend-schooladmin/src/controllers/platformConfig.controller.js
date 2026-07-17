import { platformConfigService } from '../services/platformConfig.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getConfiguration = asyncHandler(async (req, res) => {
  const [appearance, branding, features, security, integrations] = await Promise.all([
    platformConfigService.getAppearance(),
    platformConfigService.getBranding(),
    platformConfigService.getFeatures(),
    platformConfigService.getSecurity(),
    platformConfigService.getIntegrationsMasked(),
  ]);
  return ok(res, { appearance, branding, features, security, integrations });
});

export const updateAppearance = asyncHandler(async (req, res) => {
  await platformConfigService.setAppearance(req.body);
  return ok(res, req.body, 'Appearance updated');
});

export const updateBranding = asyncHandler(async (req, res) => {
  await platformConfigService.setBranding(req.body);
  return ok(res, req.body, 'Branding updated');
});

export const updateFeatures = asyncHandler(async (req, res) => {
  await platformConfigService.setFeatures(req.body);
  return ok(res, req.body, 'Feature toggles updated');
});

export const updateSecurity = asyncHandler(async (req, res) => {
  await platformConfigService.setSecurity(req.body);
  return ok(res, req.body, 'Security settings updated');
});

export const updateIntegrations = asyncHandler(async (req, res) => {
  const masked = await platformConfigService.setIntegrations(req.body);
  return ok(res, masked, 'Integration keys saved');
});
