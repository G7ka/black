import { schoolManagementService } from '../services/schoolManagement.service.js';
import { auditLogRepository } from '../repositories/auditLog.repository.js';
import { platformAdminRepository } from '../repositories/platformAdmin.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { toSchoolDTO } from '../dtos/auth.dto.js';

async function audit(req, action, metadata) {
  const admin = await platformAdminRepository.findById(req.auth.sub);
  return auditLogRepository.record({
    action,
    performedById: req.auth.sub,
    performedByName: admin?.name || req.auth.sub,
    metadata,
  });
}

export const listSchools = asyncHandler(async (req, res) => {
  const { schools, total, page, pageSize } = await schoolManagementService.list(req.query);
  return ok(res, { schools: schools.map(toSchoolDTO), total, page, pageSize });
});

export const getSchool = asyncHandler(async (req, res) => {
  const school = await schoolManagementService.getById(req.params.id);
  return ok(res, toSchoolDTO(school));
});

export const approveSchool = asyncHandler(async (req, res) => {
  const { school } = await schoolManagementService.approve(req.params.id);
  await audit(req, 'SCHOOL_APPROVED', { schoolId: school.id, name: school.name });
  return ok(res, toSchoolDTO(school), 'School approved and activated');
});

export const rejectSchool = asyncHandler(async (req, res) => {
  const school = await schoolManagementService.reject(req.params.id, req.body.reason);
  await audit(req, 'SCHOOL_REJECTED', { schoolId: school.id, reason: req.body.reason });
  return ok(res, toSchoolDTO(school), 'School application rejected');
});

export const suspendSchool = asyncHandler(async (req, res) => {
  const school = await schoolManagementService.suspend(req.params.id, req.body.reason);
  await audit(req, 'SCHOOL_SUSPENDED', { schoolId: school.id, reason: req.body.reason });
  return ok(res, toSchoolDTO(school), 'School suspended');
});

export const reactivateSchool = asyncHandler(async (req, res) => {
  const school = await schoolManagementService.reactivate(req.params.id);
  await audit(req, 'SCHOOL_REACTIVATED', { schoolId: school.id });
  return ok(res, toSchoolDTO(school), 'School reactivated');
});

export const deleteSchool = asyncHandler(async (req, res) => {
  const school = await schoolManagementService.getById(req.params.id);
  await schoolManagementService.remove(req.params.id);
  await audit(req, 'SCHOOL_DELETED', { schoolId: school.id, name: school.name });
  return ok(res, null, 'School permanently deleted');
});

export const renameSchool = asyncHandler(async (req, res) => {
  const school = await schoolManagementService.renameSchool(req.params.id, req.body.newName);
  await audit(req, 'SCHOOL_RENAMED', { schoolId: school.id, newName: req.body.newName });
  return ok(res, toSchoolDTO(school), 'School name updated');
});

export const impersonateSchoolAdmin = asyncHandler(async (req, res) => {
  const { accessToken, school } = await schoolManagementService.impersonate(req.params.id);
  await audit(req, 'SCHOOL_ADMIN_IMPERSONATED', { schoolId: school.id });
  return ok(res, { accessToken, school: toSchoolDTO(school) }, 'Impersonation token issued');
});

export const adminCreateSchool = asyncHandler(async (req, res) => {
  const { school, username } = await schoolManagementService.adminCreateSchool(req.body);
  return created(res, { school: toSchoolDTO(school), adminUsername: username }, 'School created');
});
