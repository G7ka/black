import { platformAdminManagementService } from '../services/platformAdminManagement.service.js';
import { toPlatformAdminDTO } from '../dtos/auth.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listAdmins = asyncHandler(async (req, res) => {
  const admins = await platformAdminManagementService.list();
  return ok(res, admins.map(toPlatformAdminDTO));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const admin = await platformAdminManagementService.create(req.body);
  return created(res, toPlatformAdminDTO(admin), 'Admin added successfully');
});

export const removeAdmin = asyncHandler(async (req, res) => {
  await platformAdminManagementService.remove(req.params.id, req.auth.sub);
  return ok(res, null, 'Admin removed');
});
