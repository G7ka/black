import { schoolRegistrationService } from '../services/schoolRegistration.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { toSchoolDTO } from '../dtos/auth.dto.js';

// GET /api/v1/schools/check-subdomain?subdomain=xyz — SchoolRegistration.jsx step 3 live check
export const checkSubdomain = asyncHandler(async (req, res) => {
  const { subdomain } = req.query;
  const result = await schoolRegistrationService.checkSubdomainAvailability(subdomain);
  return ok(res, result);
});

// POST /api/v1/schools/register — SchoolRegistration.jsx final submit (multipart/form-data)
export const registerSchool = asyncHandler(async (req, res) => {
  const licenseFileUrl = req.file ? `/uploads/licenses/${req.file.filename}` : null;
  const { school } = await schoolRegistrationService.register(req.body, licenseFileUrl);
  return created(res, { school: toSchoolDTO(school) }, 'Application received');
});


export const getPricing = asyncHandler(async (req, res) => {
  const pricePerStudent = await schoolRegistrationService.getPricePerStudent();
  return ok(res, { pricePerStudent });
});


// GET /api/v1/schools/search?q=kampala — Public landing page school finder
export const searchSchools = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const schools = await schoolRegistrationService.searchSchools(q);

  return ok(res, schools, 'Schools found');
});