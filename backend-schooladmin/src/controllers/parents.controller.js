import { parentService } from '../services/schoolAdmin/parent.service.js';
import { toParentDTO } from '../dtos/schoolAdmin.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';

export const listParents = asyncHandler(async (req, res) => {
  const parents = await parentService.list(req.auth.schoolId, { search: req.query.search, status: req.query.status });
  return ok(res, parents.map(toParentDTO));
});

export const getParent = asyncHandler(async (req, res) => {
  const parent = await parentService.getById(req.auth.schoolId, req.params.id);
  return ok(res, toParentDTO(parent));
});

export const createParent = asyncHandler(async (req, res) => {
  const parent = await parentService.create(req.auth.schoolId, req.body);
  return created(res, toParentDTO(parent));
});

export const updateParent = asyncHandler(async (req, res) => {
  const parent = await parentService.update(req.auth.schoolId, req.params.id, req.body);
  return ok(res, toParentDTO(parent), 'Parent updated');
});

export const setParentInactive = asyncHandler(async (req, res) => {
  const parent = await parentService.setInactive(req.auth.schoolId, req.params.id, req.body);
  return ok(res, toParentDTO(parent), 'Parent marked inactive');
});

export const setParentActive = asyncHandler(async (req, res) => {
  const parent = await parentService.setActive(req.auth.schoolId, req.params.id);
  return ok(res, toParentDTO(parent), 'Parent marked active');
});
