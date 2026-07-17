export function toClassDTO(cls) {
  return {
    id: cls.id,
    name: cls.name,
    tier: cls.tier,
    order: cls.order,
    streams: cls.streams?.map((s) => ({ id: s.id, name: s.name })) || [],
    subjects: cls.classSubjects?.map((cs) => ({ id: cs.subject.id, name: cs.subject.name })) || [],
    studentCount: cls._count?.students ?? undefined,
  };
}

export function toSubjectDTO(s) {
  return { id: s.id, name: s.name };
}

export function toTeacherDTO(t) {
  return {
    id: t.id,
    userId: t.userId,
    fullName: t.user?.fullName,
    email: t.user?.email,
    subjectSpecialization: t.subjectSpecialization,
    status: t.status,
    leaveReason: t.leaveReason,
    leaveStart: t.leaveStart,
    leaveEnd: t.leaveEnd,
    leaveNotes: t.leaveNotes,
    classAssignments: t.classAssignments,
    createdAt: t.createdAt,
  };
}

export function toStudentDTO(s) {
  return {
    id: s.id,
    studentCode: s.studentCode,
    firstName: s.firstName,
    lastName: s.lastName,
    fullName: `${s.firstName} ${s.lastName}`,
    dateOfBirth: s.dateOfBirth,
    gender: s.gender,
    classId: s.classId,
    className: s.class?.name,
    streamId: s.streamId,
    streamName: s.stream?.name,
    status: s.status,
    parents: s.parents?.map((sp) => ({
      id: sp.parent.id,
      fullName: sp.parent.fullName,
      phone: sp.parent.phone,
      email: sp.parent.email,
    })) || [],
  };
}

export function toParentDTO(p) {
  return {
    id: p.id,
    fullName: p.fullName,
    phone: p.phone,
    email: p.email,
    status: p.status,
    inactiveReason: p.inactiveReason,
    inactiveReturn: p.inactiveReturn,
    inactiveNotes: p.inactiveNotes,
    students: p.students?.map((sp) => ({
      id: sp.student.id,
      fullName: `${sp.student.firstName} ${sp.student.lastName}`,
    })) || [],
  };
}
