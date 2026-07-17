export function toPlatformAdminDTO(admin) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.status,
    lastLoginAt: admin.lastLoginAt,
  };
}

export function toUserDTO(user) {
  return {
    id: user.id,
    schoolId: user.schoolId,
    role: user.role,
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    studentCode: user.studentCode,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
  };
}

export function toSchoolDTO(school) {
  return {
    id: school.id,
    name: school.name,
    level: school.level,
    subdomain: school.subdomain,
    physicalAddress: school.physicalAddress,
    district: school.district,
    contactName: school.contactName,
    contactPhone: school.contactPhone,
    contactEmail: school.contactEmail,
    website: school.website,
    numStudentsDeclared: school.numStudentsDeclared,
    status: school.status,
    pricePerStudent: school.pricePerStudent,
    createdAt: school.createdAt,
  };
}

export function toAuthResultDTO({ accessToken, refreshToken, principal, principalType }) {
  return {
    accessToken,
    refreshToken,
    type: principalType, // 'platform' | 'tenant'
    profile: principalType === 'platform' ? toPlatformAdminDTO(principal) : toUserDTO(principal),
  };
}
