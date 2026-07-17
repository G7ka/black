import { prisma } from '../config/prisma.js';

export const schoolRepository = {
  findBySubdomain(subdomain) {
    return prisma.school.findUnique({ where: { subdomain } });
  },
  findById(id) {
    return prisma.school.findUnique({ where: { id } });
  },
  
  isSubdomainTaken: async (subdomain) => {
    const existing = await prisma.school.findUnique({ where: { subdomain } });
    return Boolean(existing);
  },

  searchPublicSchools(query) {
    return prisma.school.findMany({
      where: {
        status: 'ACTIVE',
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    });
  },

  createWithAdmin({ schoolData, adminData }) {
    return prisma.$transaction(async (tx) => {
      const school = await tx.school.create({ data: schoolData });
      const admin = await tx.user.create({
        data: { ...adminData, schoolId: school.id },
      });
      return { school, admin };
    });
  },

  // ── SASchools.jsx management actions ──
  findMany({ status, level, search, skip = 0, take = 20 }) {
    const where = {
      ...(status && status !== 'all' && { status: status.toUpperCase() }),
      ...(level && level !== 'all' && { level: level.toUpperCase() }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { district: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    return Promise.all([
      prisma.school.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.school.count({ where }),
    ]);
  },
  updateStatus(id, status, extra = {}) {
    return prisma.school.update({ where: { id }, data: { status, ...extra } });
  },
  updateName(id, name) {
    return prisma.school.update({ where: { id }, data: { name } });
  },
  delete(id) {
    return prisma.school.delete({ where: { id } });
  },
  firstAdminUser(schoolId) {
    return prisma.user.findFirst({
      where: { schoolId, role: { in: ['SCHOOLADMIN_PRIMARY', 'SCHOOLADMIN_SECONDARY'] } },
      orderBy: { createdAt: 'asc' },
    });
  },
  activateAllUsers(schoolId) {
    return prisma.user.updateMany({
      where: { schoolId, status: 'PENDING' },
      data: { status: 'ACTIVE' },
    });
  },
};

