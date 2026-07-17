import { timetableRepository } from '../../repositories/timetable.repository.js';
import { schoolClassRepository } from '../../repositories/schoolClass.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const timetableService = {
  async getForClass(schoolId, classId, streamId) {
    const cls = await schoolClassRepository.findByIdForSchool(schoolId, classId);
    if (!cls) throw ApiError.notFound('Class not found');
    return timetableRepository.findForClass(classId, streamId);
  },

  async saveSlot(schoolId, { classId, streamId, dayOfWeek, timeSlot, subjectId, teacherProfileId, room }) {
    const cls = await schoolClassRepository.findByIdForSchool(schoolId, classId);
    if (!cls) throw ApiError.notFound('Class not found');
    return timetableRepository.upsertEntry({ schoolId, classId, streamId, dayOfWeek, timeSlot, subjectId, teacherProfileId, room });
  },

  async deleteSlot(schoolId, classId, streamId, dayOfWeek, timeSlot) {
    const entry = await timetableRepository.findEntry(classId, streamId, dayOfWeek, timeSlot);
    if (!entry || entry.schoolId !== schoolId) throw ApiError.notFound('Timetable entry not found');
    return timetableRepository.deleteEntry(entry.id);
  },
};
