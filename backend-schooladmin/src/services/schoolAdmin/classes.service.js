import { schoolClassRepository } from '../../repositories/schoolClass.repository.js';
import { subjectRepository } from '../../repositories/subject.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const classesService = {
  list: (schoolId) => schoolClassRepository.findAllForSchool(schoolId),

  async create(schoolId, { name, tier }) {
    const order = await schoolClassRepository.nextOrder(schoolId);
    return schoolClassRepository.create({ schoolId, name, tier, order });
  },

  async addStream(schoolId, classId, name) {
    const cls = await schoolClassRepository.findByIdForSchool(schoolId, classId);
    if (!cls) throw ApiError.notFound('Class not found');
    return schoolClassRepository.addStream(classId, name);
  },

  async removeStream(schoolId, classId, streamId) {
    const stream = await schoolClassRepository.findStreamById(streamId);
    if (!stream || stream.classId !== classId) throw ApiError.notFound('Stream not found');
    return schoolClassRepository.removeStream(streamId);
  },

  async setSubjects(schoolId, classId, subjectIds) {
    const cls = await schoolClassRepository.findByIdForSchool(schoolId, classId);
    if (!cls) throw ApiError.notFound('Class not found');
    await schoolClassRepository.setSubjects(classId, subjectIds);
    return schoolClassRepository.findById(classId);
  },

  // ── Subjects (school-wide subject catalog, consumed by class assignment) ──
  listSubjects: (schoolId) => subjectRepository.findAllForSchool(schoolId),

  async addSubject(schoolId, name) {
    const existing = await subjectRepository.findAllForSchool(schoolId);
    if (existing.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      throw ApiError.conflict('This subject already exists');
    }
    return subjectRepository.create(schoolId, name);
  },

  async removeSubject(schoolId, subjectId) {
    const subject = await subjectRepository.findById(subjectId);
    if (!subject || subject.schoolId !== schoolId) throw ApiError.notFound('Subject not found');
    return subjectRepository.delete(subjectId);
  },
};
