import { parentRepository } from '../../repositories/parent.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const parentService = {
  list: (schoolId, opts) => parentRepository.findAllForSchool(schoolId, opts),

  async getById(schoolId, id) {
    const parent = await parentRepository.findByIdForSchool(schoolId, id);
    if (!parent) throw ApiError.notFound('Parent not found');
    return parentRepository.findById(id);
  },

  async create(schoolId, { fullName, phone, email }) {
    if (email) {
      const existing = await parentRepository.findByEmailInSchool(schoolId, email);
      if (existing) throw ApiError.conflict('A parent with this email already exists');
    }
    return parentRepository.create({ schoolId, fullName, phone, email, status: 'ACTIVE' });
  },

  async update(schoolId, id, { fullName, phone, email }) {
    await this.getById(schoolId, id);
    return parentRepository.update(id, { fullName, phone, email });
  },

  async setInactive(schoolId, id, { inactiveReason, inactiveReturn, inactiveNotes }) {
    await this.getById(schoolId, id);
    return parentRepository.update(id, {
      status: 'INACTIVE',
      inactiveReason,
      inactiveReturn: inactiveReturn ? new Date(inactiveReturn) : null,
      inactiveNotes,
    });
  },

  async setActive(schoolId, id) {
    await this.getById(schoolId, id);
    return parentRepository.update(id, {
      status: 'ACTIVE',
      inactiveReason: null,
      inactiveReturn: null,
      inactiveNotes: null,
    });
  },
};
