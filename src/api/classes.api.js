import { client, unwrap } from './client';

export const classesApi = {
  list: () => unwrap(client.get('/school/classes')),
  create: (payload) => unwrap(client.post('/school/classes', payload)),
  addStream: (classId, name) => unwrap(client.post(`/school/classes/${classId}/streams`, { name })),
  removeStream: (classId, streamId) => unwrap(client.delete(`/school/classes/${classId}/streams/${streamId}`)),
  setSubjects: (classId, subjectIds) => unwrap(client.put(`/school/classes/${classId}/subjects`, { subjectIds })),
  listSubjects: () => unwrap(client.get('/school/classes/subjects')),
  addSubject: (name) => unwrap(client.post('/school/classes/subjects', { name })),
  removeSubject: (subjectId) => unwrap(client.delete(`/school/classes/subjects/${subjectId}`)),
};
