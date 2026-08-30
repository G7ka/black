import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────
const hash = (pw) => bcrypt.hashSync(pw, 10);
const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const daysFromNow = (n) => new Date(Date.now() + n * 86400000);

const DEFAULT_PASSWORD = 'Password123!';
const CURRENT_TERM = 'Term 1 2026';

// ─────────────────────────────────────────────────────────
// SEED — every upsert captures the real DB id for downstream FK refs
// ─────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting full database seed...\n');

  // ── 1. Platform Admins ────────────────────────────────
  console.log('  ➤ Seeding Platform Admins...');
  const superAdmin = await prisma.platformAdmin.upsert({
    where: { email: 'bibmarley843@gmail.com' },
    update: {},
    create: { name: 'Admin Platform', email: 'bibmarley843@gmail.com', passwordHash: hash(DEFAULT_PASSWORD), role: 'SUPER_ADMIN', status: 'ACTIVE' },
  });
  const financeAdmin = await prisma.platformAdmin.upsert({
    where: { email: 'finance@edumanage.com' },
    update: {},
    create: { name: 'Finance Manager', email: 'finance@edumanage.com', passwordHash: hash(DEFAULT_PASSWORD), role: 'FINANCE_ADMIN', status: 'ACTIVE' },
  });
  const supportAgent = await prisma.platformAdmin.upsert({
    where: { email: 'support@edumanage.com' },
    update: {},
    create: { name: 'Support Agent Grace', email: 'support@edumanage.com', passwordHash: hash(DEFAULT_PASSWORD), role: 'SUPPORT_AGENT', status: 'ACTIVE' },
  });

  // ── 2. Schools ────────────────────────────────────────
  console.log('  ➤ Seeding Schools...');
  const primarySchool = await prisma.school.upsert({
    where: { subdomain: 'kampala' },
    update: {},
    create: {
      name: 'Kampala Primary School',
      level: 'PRIMARY',
      subdomain: 'kampala',
      physicalAddress: 'Plot 12, Nakasero Road, Kampala',
      district: 'Kampala',
      contactName: 'Mrs. Sarah Namugga',
      contactPhone: '+256700100200',
      contactEmail: 'admin@kampalaprimary.ac.ug',
      website: 'https://kampalaprimary.ac.ug',
      numStudentsDeclared: 450,
      status: 'ACTIVE',
      pricePerStudent: 2000,
      motto: 'Education for a Brighter Tomorrow',
      currentTerm: CURRENT_TERM,
      termStart: new Date('2026-02-03'),
      termEnd: new Date('2026-05-02'),
      notificationSettings: { smsNotif: true, emailNotif: true, attendanceAlert: true, feeReminder: true },
    },
  });

  const secondarySchool = await prisma.school.upsert({
    where: { subdomain: 'jinja' },
    update: {},
    create: {
      name: 'Jinja Secondary School',
      level: 'SECONDARY',
      subdomain: 'jinja',
      physicalAddress: '45 Main Street, Jinja',
      district: 'Jinja',
      contactName: 'Mr. James Opio',
      contactPhone: '+256701200300',
      contactEmail: 'admin@jinjasecondary.ac.ug',
      website: 'https://jinjasecondary.ac.ug',
      numStudentsDeclared: 620,
      status: 'ACTIVE',
      pricePerStudent: 2500,
      motto: 'Knowledge is Power',
      currentTerm: CURRENT_TERM,
      termStart: new Date('2026-02-03'),
      termEnd: new Date('2026-05-02'),
      notificationSettings: { smsNotif: true, emailNotif: true, attendanceAlert: true, feeReminder: true },
    },
  });

  // ── 3. School Documents ───────────────────────────────
  console.log('  ➤ Seeding School Documents...');
  for (const schoolId of [primarySchool.id, secondarySchool.id]) {
    await prisma.schoolDocument.createMany({
      data: [
        { schoolId, type: 'LICENSE', fileUrl: '/uploads/license_certificate.pdf' },
        { schoolId, type: 'REGISTRATION', fileUrl: '/uploads/registration_doc.pdf' },
      ],
      skipDuplicates: true,
    });
  }

  // ── 4. Users (all roles) ──────────────────────────────
  console.log('  ➤ Seeding Users...');
  const passwordHash = hash(DEFAULT_PASSWORD);

  // Helper to upsert a user by schoolId+username
  const upsertUser = (data) =>
    prisma.user.upsert({
      where: { schoolId_username: { schoolId: data.schoolId, username: data.username } },
      update: {},
      create: { ...data, passwordHash },
    });

  // ── Primary school users ──
  const primaryAdmin     = await upsertUser({ schoolId: primarySchool.id, role: 'SCHOOLADMIN_PRIMARY',  fullName: 'Sarah Namugga',   email: 'admin@kampalaprimary.ac.ug',       username: 'primaryadmin' });
  const primaryTeacher1  = await upsertUser({ schoolId: primarySchool.id, role: 'TEACHER',              fullName: 'John Mukasa',     email: 'john.mukasa@kampalaprimary.ac.ug', username: 'jmukasa' });
  const primaryTeacher2  = await upsertUser({ schoolId: primarySchool.id, role: 'TEACHER',              fullName: 'Rose Atim',       email: 'rose.atim@kampalaprimary.ac.ug',   username: 'ratim' });
  const primaryTeacher3  = await upsertUser({ schoolId: primarySchool.id, role: 'TEACHER',              fullName: 'Paul Ssemakula',  email: 'paul.s@kampalaprimary.ac.ug',      username: 'pssemakula' });
  const primaryStudent1  = await upsertUser({ schoolId: primarySchool.id, role: 'STUDENT',              fullName: 'David Kizza',     email: null, username: 'dkizza',      studentCode: 'KPS-2026-001' });
  const primaryStudent2  = await upsertUser({ schoolId: primarySchool.id, role: 'STUDENT',              fullName: 'Grace Namutebi',  email: null, username: 'gnamutebi',   studentCode: 'KPS-2026-002' });
  const primaryStudent3  = await upsertUser({ schoolId: primarySchool.id, role: 'STUDENT',              fullName: 'Moses Lubega',    email: null, username: 'mlubega',     studentCode: 'KPS-2026-003' });
  const primaryStudent4  = await upsertUser({ schoolId: primarySchool.id, role: 'STUDENT',              fullName: 'Faith Nakitto',   email: null, username: 'fnakitto',    studentCode: 'KPS-2026-004' });
  const primaryStudent5  = await upsertUser({ schoolId: primarySchool.id, role: 'STUDENT',              fullName: 'Isaac Sserwanga', email: null, username: 'isserwanga',  studentCode: 'KPS-2026-005' });
  const primaryStudent6  = await upsertUser({ schoolId: primarySchool.id, role: 'STUDENT',              fullName: 'Peace Nakafeero', email: null, username: 'pnakafeero',  studentCode: 'KPS-2026-006' });
  const primaryParent1   = await upsertUser({ schoolId: primarySchool.id, role: 'PARENT',               fullName: 'Robert Kizza',    email: 'robert.kizza@gmail.com', username: 'rkizza' });
  const primaryParent2   = await upsertUser({ schoolId: primarySchool.id, role: 'PARENT',               fullName: 'Betty Namutebi',  email: 'betty.n@gmail.com',      username: 'bnamutebi' });
  const primaryParent3   = await upsertUser({ schoolId: primarySchool.id, role: 'PARENT',               fullName: 'Godfrey Lubega',  email: 'godfrey.l@gmail.com',    username: 'glubega' });

  // ── Secondary school users ──
  const secondaryAdmin     = await upsertUser({ schoolId: secondarySchool.id, role: 'SCHOOLADMIN_SECONDARY', fullName: 'James Opio',       email: 'admin@jinjasecondary.ac.ug',       username: 'secondaryadmin' });
  const secondaryTeacher1  = await upsertUser({ schoolId: secondarySchool.id, role: 'TEACHER',               fullName: 'Alice Wamala',     email: 'alice.w@jinjasecondary.ac.ug',     username: 'awamala' });
  const secondaryTeacher2  = await upsertUser({ schoolId: secondarySchool.id, role: 'TEACHER',               fullName: 'Charles Okello',   email: 'charles.o@jinjasecondary.ac.ug',   username: 'cokello' });
  const secondaryTeacher3  = await upsertUser({ schoolId: secondarySchool.id, role: 'TEACHER',               fullName: 'Dorothy Nabirye',  email: 'dorothy.n@jinjasecondary.ac.ug',   username: 'dnabirye' });
  const secondaryStudent1  = await upsertUser({ schoolId: secondarySchool.id, role: 'STUDENT',               fullName: 'Brian Wafula',     email: null, username: 'bwafula',     studentCode: 'JSS-2026-001' });
  const secondaryStudent2  = await upsertUser({ schoolId: secondarySchool.id, role: 'STUDENT',               fullName: 'Irene Nakamya',    email: null, username: 'inakamya',    studentCode: 'JSS-2026-002' });
  const secondaryStudent3  = await upsertUser({ schoolId: secondarySchool.id, role: 'STUDENT',               fullName: 'Samuel Muwanga',   email: null, username: 'smuwanga',    studentCode: 'JSS-2026-003' });
  const secondaryStudent4  = await upsertUser({ schoolId: secondarySchool.id, role: 'STUDENT',               fullName: 'Agnes Babirye',    email: null, username: 'ababirye',    studentCode: 'JSS-2026-004' });
  const secondaryStudent5  = await upsertUser({ schoolId: secondarySchool.id, role: 'STUDENT',               fullName: 'Peter Waiswa',     email: null, username: 'pwaiswa',     studentCode: 'JSS-2026-005' });
  const secondaryStudent6  = await upsertUser({ schoolId: secondarySchool.id, role: 'STUDENT',               fullName: 'Hope Nansubuga',   email: null, username: 'hnansubuga',  studentCode: 'JSS-2026-006' });
  const secondaryParent1   = await upsertUser({ schoolId: secondarySchool.id, role: 'PARENT',                fullName: 'Francis Wafula',   email: 'francis.w@gmail.com', username: 'fwafula' });
  const secondaryParent2   = await upsertUser({ schoolId: secondarySchool.id, role: 'PARENT',                fullName: 'Mary Nakamya',     email: 'mary.n@gmail.com',    username: 'mnakamya' });
  const secondaryParent3   = await upsertUser({ schoolId: secondarySchool.id, role: 'PARENT',                fullName: 'Joseph Muwanga',   email: 'joseph.m@gmail.com',  username: 'jmuwanga' });

  // ── 5. Platform Config ────────────────────────────────
  console.log('  ➤ Seeding Platform Config...');
  const configs = [
    { key: 'defaultPricePerStudent', value: 2000 },
    { key: 'supportEmail', value: 'support@edumanage.com' },
    { key: 'maintenanceMode', value: false },
    { key: 'allowNewRegistrations', value: true },
    { key: 'defaultTermDates', value: { term1Start: '2026-02-03', term1End: '2026-05-02', term2Start: '2026-06-01', term2End: '2026-08-28', term3Start: '2026-09-14', term3End: '2026-12-04' } },
  ];
  for (const c of configs) {
    await prisma.platformConfig.upsert({ where: { key: c.key }, update: {}, create: { key: c.key, value: c.value } });
  }

  // ── 6. Subjects ───────────────────────────────────────
  console.log('  ➤ Seeding Subjects...');
  const upsertSubject = (schoolId, name) =>
    prisma.subject.upsert({ where: { schoolId_name: { schoolId, name } }, update: {}, create: { schoolId, name } });

  const subjPriMath    = await upsertSubject(primarySchool.id, 'Mathematics');
  const subjPriEng     = await upsertSubject(primarySchool.id, 'English');
  const subjPriSci     = await upsertSubject(primarySchool.id, 'Science');
  const subjPriSST     = await upsertSubject(primarySchool.id, 'Social Studies');
  const subjPriRW      = await upsertSubject(primarySchool.id, 'Reading & Writing');

  const subjSecMath    = await upsertSubject(secondarySchool.id, 'Mathematics');
  const subjSecEng     = await upsertSubject(secondarySchool.id, 'English');
  const subjSecPhy     = await upsertSubject(secondarySchool.id, 'Physics');
  const subjSecChem    = await upsertSubject(secondarySchool.id, 'Chemistry');
  const subjSecBio     = await upsertSubject(secondarySchool.id, 'Biology');
  const subjSecHist    = await upsertSubject(secondarySchool.id, 'History');
  const subjSecGeo     = await upsertSubject(secondarySchool.id, 'Geography');
  const subjSecComp    = await upsertSubject(secondarySchool.id, 'Computer Science');

  // ── 7. Classes ────────────────────────────────────────
  console.log('  ➤ Seeding Classes...');
  const upsertClass = (schoolId, name, tier, order) =>
    prisma.schoolClass.upsert({ where: { schoolId_name: { schoolId, name } }, update: {}, create: { schoolId, name, tier, order } });

  const classP1 = await upsertClass(primarySchool.id, 'Primary 1', 'Lower Primary', 1);
  const classP2 = await upsertClass(primarySchool.id, 'Primary 2', 'Lower Primary', 2);
  const classP3 = await upsertClass(primarySchool.id, 'Primary 3', 'Lower Primary', 3);
  const classP4 = await upsertClass(primarySchool.id, 'Primary 4', 'Upper Primary', 4);
  const classP5 = await upsertClass(primarySchool.id, 'Primary 5', 'Upper Primary', 5);
  const classP6 = await upsertClass(primarySchool.id, 'Primary 6', 'Upper Primary', 6);
  const classP7 = await upsertClass(primarySchool.id, 'Primary 7', 'Upper Primary', 7);

  const classS1 = await upsertClass(secondarySchool.id, 'Senior 1', 'O-Level', 1);
  const classS2 = await upsertClass(secondarySchool.id, 'Senior 2', 'O-Level', 2);
  const classS3 = await upsertClass(secondarySchool.id, 'Senior 3', 'O-Level', 3);
  const classS4 = await upsertClass(secondarySchool.id, 'Senior 4', 'O-Level', 4);
  const classS5 = await upsertClass(secondarySchool.id, 'Senior 5', 'A-Level', 5);
  const classS6 = await upsertClass(secondarySchool.id, 'Senior 6', 'A-Level', 6);

  // ── 8. Streams (Secondary only) ──────────────────────
  console.log('  ➤ Seeding Streams...');
  const upsertStream = (classId, name) =>
    prisma.schoolClassStream.upsert({ where: { classId_name: { classId, name } }, update: {}, create: { classId, name } });

  const streamS1A = await upsertStream(classS1.id, 'S1A');
  const streamS1B = await upsertStream(classS1.id, 'S1B');
  const streamS2A = await upsertStream(classS2.id, 'S2A');
  const streamS2B = await upsertStream(classS2.id, 'S2B');
  const streamS3A = await upsertStream(classS3.id, 'S3A');
  const streamS4A = await upsertStream(classS4.id, 'S4A');

  // ── 9. Class-Subject assignments ──────────────────────
  console.log('  ➤ Seeding Class-Subject assignments...');
  const upsertCS = (classId, subjectId) =>
    prisma.classSubject.upsert({ where: { classId_subjectId: { classId, subjectId } }, update: {}, create: { classId, subjectId } });

  const priClasses = [classP1, classP2, classP3, classP4, classP5, classP6, classP7];
  const priSubjects = [subjPriMath, subjPriEng, subjPriSci, subjPriSST, subjPriRW];
  for (const cls of priClasses) for (const subj of priSubjects) await upsertCS(cls.id, subj.id);

  const secClasses = [classS1, classS2, classS3, classS4, classS5, classS6];
  const secSubjects = [subjSecMath, subjSecEng, subjSecPhy, subjSecChem, subjSecBio, subjSecHist, subjSecGeo, subjSecComp];
  for (const cls of secClasses) for (const subj of secSubjects) await upsertCS(cls.id, subj.id);

  // ── 10. Teacher Profiles ──────────────────────────────
  console.log('  ➤ Seeding Teacher Profiles...');
  const upsertTP = (data) =>
    prisma.teacherProfile.upsert({ where: { userId: data.userId }, update: {}, create: data });

  const tpPri1 = await upsertTP({ userId: primaryTeacher1.id, schoolId: primarySchool.id, subjectSpecialization: 'Mathematics', status: 'ACTIVE' });
  const tpPri2 = await upsertTP({ userId: primaryTeacher2.id, schoolId: primarySchool.id, subjectSpecialization: 'English',     status: 'ACTIVE' });
  const tpPri3 = await upsertTP({ userId: primaryTeacher3.id, schoolId: primarySchool.id, subjectSpecialization: 'Science',     status: 'ON_LEAVE', leaveReason: 'Maternity Leave', leaveStart: daysAgo(14), leaveEnd: daysFromNow(46), leaveNotes: 'Expected back mid-October' });

  const tpSec1 = await upsertTP({ userId: secondaryTeacher1.id, schoolId: secondarySchool.id, subjectSpecialization: 'Physics',     status: 'ACTIVE' });
  const tpSec2 = await upsertTP({ userId: secondaryTeacher2.id, schoolId: secondarySchool.id, subjectSpecialization: 'Mathematics', status: 'ACTIVE' });
  const tpSec3 = await upsertTP({ userId: secondaryTeacher3.id, schoolId: secondarySchool.id, subjectSpecialization: 'Biology',     status: 'ACTIVE' });

  // ── 11. Teacher Class-Subject assignments ─────────────
  console.log('  ➤ Seeding Teacher Class-Subject assignments...');
  const upsertTCS = (teacherProfileId, classId, subjectId) =>
    prisma.teacherClassSubject.upsert({
      where: { teacherProfileId_classId_subjectId: { teacherProfileId, classId, subjectId } },
      update: {},
      create: { teacherProfileId, classId, subjectId },
    });

  await upsertTCS(tpPri1.id, classP1.id, subjPriMath.id);
  await upsertTCS(tpPri1.id, classP2.id, subjPriMath.id);
  await upsertTCS(tpPri1.id, classP3.id, subjPriMath.id);
  await upsertTCS(tpPri2.id, classP1.id, subjPriEng.id);
  await upsertTCS(tpPri2.id, classP2.id, subjPriEng.id);
  await upsertTCS(tpPri3.id, classP4.id, subjPriSci.id);
  await upsertTCS(tpPri3.id, classP5.id, subjPriSci.id);

  await upsertTCS(tpSec1.id, classS1.id, subjSecPhy.id);
  await upsertTCS(tpSec1.id, classS2.id, subjSecPhy.id);
  await upsertTCS(tpSec2.id, classS1.id, subjSecMath.id);
  await upsertTCS(tpSec2.id, classS3.id, subjSecMath.id);
  await upsertTCS(tpSec3.id, classS1.id, subjSecBio.id);
  await upsertTCS(tpSec3.id, classS2.id, subjSecBio.id);

  // ── 12. Students ──────────────────────────────────────
  console.log('  ➤ Seeding Students...');
  const upsertStudent = (data) =>
    prisma.student.upsert({
      where: { schoolId_studentCode: { schoolId: data.schoolId, studentCode: data.studentCode } },
      update: {},
      create: data,
    });

  const stPri1 = await upsertStudent({ schoolId: primarySchool.id, userId: primaryStudent1.id, studentCode: 'KPS-2026-001', firstName: 'David',  lastName: 'Kizza',     dateOfBirth: new Date('2016-03-15'), gender: 'MALE',   classId: classP1.id, status: 'ACTIVE' });
  const stPri2 = await upsertStudent({ schoolId: primarySchool.id, userId: primaryStudent2.id, studentCode: 'KPS-2026-002', firstName: 'Grace',  lastName: 'Namutebi',  dateOfBirth: new Date('2015-07-22'), gender: 'FEMALE', classId: classP2.id, status: 'ACTIVE' });
  const stPri3 = await upsertStudent({ schoolId: primarySchool.id, userId: primaryStudent3.id, studentCode: 'KPS-2026-003', firstName: 'Moses',  lastName: 'Lubega',    dateOfBirth: new Date('2015-01-10'), gender: 'MALE',   classId: classP3.id, status: 'ACTIVE' });
  const stPri4 = await upsertStudent({ schoolId: primarySchool.id, userId: primaryStudent4.id, studentCode: 'KPS-2026-004', firstName: 'Faith',  lastName: 'Nakitto',   dateOfBirth: new Date('2014-11-05'), gender: 'FEMALE', classId: classP4.id, status: 'ACTIVE' });
  const stPri5 = await upsertStudent({ schoolId: primarySchool.id, userId: primaryStudent5.id, studentCode: 'KPS-2026-005', firstName: 'Isaac',  lastName: 'Sserwanga', dateOfBirth: new Date('2013-06-18'), gender: 'MALE',   classId: classP5.id, status: 'ACTIVE' });
  const stPri6 = await upsertStudent({ schoolId: primarySchool.id, userId: primaryStudent6.id, studentCode: 'KPS-2026-006', firstName: 'Peace',  lastName: 'Nakafeero', dateOfBirth: new Date('2016-09-02'), gender: 'FEMALE', classId: classP1.id, status: 'ACTIVE' });

  const stSec1 = await upsertStudent({ schoolId: secondarySchool.id, userId: secondaryStudent1.id, studentCode: 'JSS-2026-001', firstName: 'Brian',  lastName: 'Wafula',    dateOfBirth: new Date('2012-04-12'), gender: 'MALE',   classId: classS1.id, streamId: streamS1A.id, status: 'ACTIVE' });
  const stSec2 = await upsertStudent({ schoolId: secondarySchool.id, userId: secondaryStudent2.id, studentCode: 'JSS-2026-002', firstName: 'Irene',  lastName: 'Nakamya',   dateOfBirth: new Date('2012-08-30'), gender: 'FEMALE', classId: classS1.id, streamId: streamS1B.id, status: 'ACTIVE' });
  const stSec3 = await upsertStudent({ schoolId: secondarySchool.id, userId: secondaryStudent3.id, studentCode: 'JSS-2026-003', firstName: 'Samuel', lastName: 'Muwanga',   dateOfBirth: new Date('2011-12-25'), gender: 'MALE',   classId: classS2.id, streamId: streamS2A.id, status: 'ACTIVE' });
  const stSec4 = await upsertStudent({ schoolId: secondarySchool.id, userId: secondaryStudent4.id, studentCode: 'JSS-2026-004', firstName: 'Agnes',  lastName: 'Babirye',   dateOfBirth: new Date('2011-05-14'), gender: 'FEMALE', classId: classS2.id, streamId: streamS2B.id, status: 'ACTIVE' });
  const stSec5 = await upsertStudent({ schoolId: secondarySchool.id, userId: secondaryStudent5.id, studentCode: 'JSS-2026-005', firstName: 'Peter',  lastName: 'Waiswa',    dateOfBirth: new Date('2010-10-08'), gender: 'MALE',   classId: classS3.id, streamId: streamS3A.id, status: 'ACTIVE' });
  const stSec6 = await upsertStudent({ schoolId: secondarySchool.id, userId: secondaryStudent6.id, studentCode: 'JSS-2026-006', firstName: 'Hope',   lastName: 'Nansubuga', dateOfBirth: new Date('2010-02-20'), gender: 'FEMALE', classId: classS4.id, streamId: streamS4A.id, status: 'ACTIVE' });

  // ── 13. Parents ───────────────────────────────────────
  console.log('  ➤ Seeding Parents...');
  const upsertParent = (data) =>
    prisma.parent.upsert({ where: { userId: data.userId }, update: {}, create: data });

  const parPri1 = await upsertParent({ schoolId: primarySchool.id,   userId: primaryParent1.id,   fullName: 'Robert Kizza',   phone: '+256700300400', email: 'robert.kizza@gmail.com', status: 'ACTIVE' });
  const parPri2 = await upsertParent({ schoolId: primarySchool.id,   userId: primaryParent2.id,   fullName: 'Betty Namutebi', phone: '+256700400500', email: 'betty.n@gmail.com',      status: 'ACTIVE' });
  const parPri3 = await upsertParent({ schoolId: primarySchool.id,   userId: primaryParent3.id,   fullName: 'Godfrey Lubega', phone: '+256700500600', email: 'godfrey.l@gmail.com',    status: 'ACTIVE' });

  const parSec1 = await upsertParent({ schoolId: secondarySchool.id, userId: secondaryParent1.id, fullName: 'Francis Wafula', phone: '+256701300400', email: 'francis.w@gmail.com',    status: 'ACTIVE' });
  const parSec2 = await upsertParent({ schoolId: secondarySchool.id, userId: secondaryParent2.id, fullName: 'Mary Nakamya',   phone: '+256701400500', email: 'mary.n@gmail.com',       status: 'ACTIVE' });
  const parSec3 = await upsertParent({ schoolId: secondarySchool.id, userId: secondaryParent3.id, fullName: 'Joseph Muwanga', phone: '+256701500600', email: 'joseph.m@gmail.com',     status: 'ACTIVE' });

  // ── 14. Student-Parent links ──────────────────────────
  console.log('  ➤ Seeding Student-Parent links...');
  const upsertSP = (studentId, parentId, relationship) =>
    prisma.studentParent.upsert({
      where: { studentId_parentId: { studentId, parentId } },
      update: {},
      create: { studentId, parentId, relationship },
    });

  await upsertSP(stPri1.id, parPri1.id, 'Father');
  await upsertSP(stPri6.id, parPri1.id, 'Father');   // Robert has 2 kids
  await upsertSP(stPri2.id, parPri2.id, 'Mother');
  await upsertSP(stPri3.id, parPri3.id, 'Father');
  await upsertSP(stPri4.id, parPri3.id, 'Father');   // Godfrey has 2 kids

  await upsertSP(stSec1.id, parSec1.id, 'Father');
  await upsertSP(stSec2.id, parSec2.id, 'Mother');
  await upsertSP(stSec4.id, parSec2.id, 'Mother');   // Mary has 2 kids
  await upsertSP(stSec3.id, parSec3.id, 'Father');

  // ── 15. Attendance Records ────────────────────────────
  console.log('  ➤ Seeding Attendance Records...');
  const attendanceWeights = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'ABSENT', 'EXCUSED'];
  const allStudentRefs = [
    { id: stPri1.id, schoolId: primarySchool.id,   classId: classP1.id, markedBy: primaryTeacher1.id },
    { id: stPri2.id, schoolId: primarySchool.id,   classId: classP2.id, markedBy: primaryTeacher2.id },
    { id: stPri3.id, schoolId: primarySchool.id,   classId: classP3.id, markedBy: primaryTeacher1.id },
    { id: stPri4.id, schoolId: primarySchool.id,   classId: classP4.id, markedBy: primaryTeacher3.id },
    { id: stPri5.id, schoolId: primarySchool.id,   classId: classP5.id, markedBy: primaryTeacher3.id },
    { id: stPri6.id, schoolId: primarySchool.id,   classId: classP1.id, markedBy: primaryTeacher1.id },
    { id: stSec1.id, schoolId: secondarySchool.id, classId: classS1.id, markedBy: secondaryTeacher1.id },
    { id: stSec2.id, schoolId: secondarySchool.id, classId: classS1.id, markedBy: secondaryTeacher1.id },
    { id: stSec3.id, schoolId: secondarySchool.id, classId: classS2.id, markedBy: secondaryTeacher2.id },
    { id: stSec4.id, schoolId: secondarySchool.id, classId: classS2.id, markedBy: secondaryTeacher2.id },
    { id: stSec5.id, schoolId: secondarySchool.id, classId: classS3.id, markedBy: secondaryTeacher3.id },
    { id: stSec6.id, schoolId: secondarySchool.id, classId: classS4.id, markedBy: secondaryTeacher3.id },
  ];

  for (let day = 1; day <= 10; day++) {
    const dateVal = daysAgo(day);
    const dow = dateVal.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    for (const st of allStudentRefs) {
      const status = attendanceWeights[Math.floor(Math.random() * attendanceWeights.length)];
      try {
        await prisma.attendanceRecord.create({
          data: { schoolId: st.schoolId, studentId: st.id, classId: st.classId, date: dateVal, status, markedByUserId: st.markedBy },
        });
      } catch { /* skip duplicate studentId+date */ }
    }
  }

  // ── 16. Timetable Entries ─────────────────────────────
  console.log('  ➤ Seeding Timetable Entries...');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '8:00 AM - 8:40 AM', '8:40 AM - 9:20 AM', '9:40 AM - 10:20 AM',
    '10:20 AM - 11:00 AM', '11:20 AM - 12:00 PM', '2:00 PM - 2:40 PM', '2:40 PM - 3:20 PM',
  ];

  // Primary P1 timetable
  const priSubjCycle = [subjPriMath.id, subjPriEng.id, subjPriSci.id, subjPriSST.id, subjPriRW.id];
  const priTPCycle   = [tpPri1.id, tpPri2.id, tpPri1.id, tpPri2.id, tpPri2.id];
  let pi = 0;
  for (const d of days) {
    for (const slot of timeSlots.slice(0, 5)) {
      try {
        await prisma.timetableEntry.create({
          data: { schoolId: primarySchool.id, classId: classP1.id, dayOfWeek: d, timeSlot: slot, subjectId: priSubjCycle[pi % priSubjCycle.length], teacherProfileId: priTPCycle[pi % priTPCycle.length], room: 'Room P1' },
        });
      } catch { /* skip duplicates */ }
      pi++;
    }
  }

  // Secondary S1A timetable
  const secSubjCycle = [subjSecMath.id, subjSecEng.id, subjSecPhy.id, subjSecChem.id, subjSecBio.id, subjSecHist.id, subjSecGeo.id];
  const secTPCycle   = [tpSec2.id, tpSec1.id, tpSec1.id, tpSec3.id, tpSec3.id, tpSec2.id, tpSec1.id];
  let si = 0;
  for (const d of days) {
    for (const slot of timeSlots) {
      try {
        await prisma.timetableEntry.create({
          data: { schoolId: secondarySchool.id, classId: classS1.id, streamId: streamS1A.id, dayOfWeek: d, timeSlot: slot, subjectId: secSubjCycle[si % secSubjCycle.length], teacherProfileId: secTPCycle[si % secTPCycle.length], room: 'Lab 1' },
        });
      } catch { /* skip duplicates */ }
      si++;
    }
  }

  // ── 17. Fee Structures ────────────────────────────────
  console.log('  ➤ Seeding Fee Structures...');
  const feeData = [
    { schoolId: primarySchool.id,   classId: classP1.id, term: CURRENT_TERM, tuition: 350000, lunch: 120000, activities: 50000 },
    { schoolId: primarySchool.id,   classId: classP2.id, term: CURRENT_TERM, tuition: 350000, lunch: 120000, activities: 50000 },
    { schoolId: primarySchool.id,   classId: classP3.id, term: CURRENT_TERM, tuition: 380000, lunch: 120000, activities: 55000 },
    { schoolId: primarySchool.id,   classId: classP4.id, term: CURRENT_TERM, tuition: 400000, lunch: 130000, activities: 60000 },
    { schoolId: primarySchool.id,   classId: classP5.id, term: CURRENT_TERM, tuition: 420000, lunch: 130000, activities: 60000 },
    { schoolId: primarySchool.id,   classId: classP6.id, term: CURRENT_TERM, tuition: 450000, lunch: 130000, activities: 65000 },
    { schoolId: primarySchool.id,   classId: classP7.id, term: CURRENT_TERM, tuition: 500000, lunch: 140000, activities: 80000 },
    { schoolId: secondarySchool.id, classId: classS1.id, term: CURRENT_TERM, tuition: 650000, lunch: 180000, activities: 100000 },
    { schoolId: secondarySchool.id, classId: classS2.id, term: CURRENT_TERM, tuition: 650000, lunch: 180000, activities: 100000 },
    { schoolId: secondarySchool.id, classId: classS3.id, term: CURRENT_TERM, tuition: 700000, lunch: 180000, activities: 110000 },
    { schoolId: secondarySchool.id, classId: classS4.id, term: CURRENT_TERM, tuition: 750000, lunch: 200000, activities: 120000 },
    { schoolId: secondarySchool.id, classId: classS5.id, term: CURRENT_TERM, tuition: 850000, lunch: 200000, activities: 150000 },
    { schoolId: secondarySchool.id, classId: classS6.id, term: CURRENT_TERM, tuition: 900000, lunch: 200000, activities: 150000 },
  ];
  for (const fs of feeData) {
    await prisma.classFeeStructure.upsert({ where: { classId: fs.classId }, update: {}, create: fs });
  }

  // ── 18. Student Fee Payments ──────────────────────────
  console.log('  ➤ Seeding Student Fee Payments...');
  let rc = Date.now(); // unique receipt counter
  const payments = [
    { schoolId: primarySchool.id,   studentId: stPri1.id, term: CURRENT_TERM, amount: 520000, method: 'Mobile Money',  recordedByUserId: primaryAdmin.id,   receiptNumber: `KPS-REC-${++rc}`, paidAt: daysAgo(30) },
    { schoolId: primarySchool.id,   studentId: stPri2.id, term: CURRENT_TERM, amount: 350000, method: 'Bank Transfer', recordedByUserId: primaryAdmin.id,   receiptNumber: `KPS-REC-${++rc}`, paidAt: daysAgo(25) },
    { schoolId: primarySchool.id,   studentId: stPri2.id, term: CURRENT_TERM, amount: 170000, method: 'Cash',          recordedByUserId: primaryAdmin.id,   receiptNumber: `KPS-REC-${++rc}`, paidAt: daysAgo(10) },
    { schoolId: primarySchool.id,   studentId: stPri3.id, term: CURRENT_TERM, amount: 300000, method: 'Cash',          recordedByUserId: primaryAdmin.id,   receiptNumber: `KPS-REC-${++rc}`, paidAt: daysAgo(20) },
    { schoolId: primarySchool.id,   studentId: stPri4.id, term: CURRENT_TERM, amount: 590000, method: 'Mobile Money',  recordedByUserId: primaryAdmin.id,   receiptNumber: `KPS-REC-${++rc}`, paidAt: daysAgo(28) },
    { schoolId: primarySchool.id,   studentId: stPri5.id, term: CURRENT_TERM, amount: 610000, method: 'Bank Transfer', recordedByUserId: primaryAdmin.id,   receiptNumber: `KPS-REC-${++rc}`, paidAt: daysAgo(27) },
    { schoolId: secondarySchool.id, studentId: stSec1.id, term: CURRENT_TERM, amount: 930000, method: 'Bank Transfer', recordedByUserId: secondaryAdmin.id, receiptNumber: `JSS-REC-${++rc}`, paidAt: daysAgo(29) },
    { schoolId: secondarySchool.id, studentId: stSec2.id, term: CURRENT_TERM, amount: 500000, method: 'Mobile Money',  recordedByUserId: secondaryAdmin.id, receiptNumber: `JSS-REC-${++rc}`, paidAt: daysAgo(22) },
    { schoolId: secondarySchool.id, studentId: stSec3.id, term: CURRENT_TERM, amount: 650000, method: 'Cash',          recordedByUserId: secondaryAdmin.id, receiptNumber: `JSS-REC-${++rc}`, paidAt: daysAgo(18) },
    { schoolId: secondarySchool.id, studentId: stSec4.id, term: CURRENT_TERM, amount: 930000, method: 'Bank Transfer', recordedByUserId: secondaryAdmin.id, receiptNumber: `JSS-REC-${++rc}`, paidAt: daysAgo(26) },
  ];
  for (const fp of payments) {
    try { await prisma.studentFeePayment.create({ data: fp }); } catch { /* skip duplicate receipts */ }
  }

  // ── 19. Teacher Absence Reports ───────────────────────
  console.log('  ➤ Seeding Teacher Absence Reports...');
  await prisma.teacherAbsenceReport.createMany({
    data: [
      { schoolId: primarySchool.id,   teacherProfileId: tpPri3.id, reportedByUserId: primaryAdmin.id,   reason: 'Maternity Leave — started 2 weeks ago', date: daysAgo(14), status: 'REVIEWED' },
      { schoolId: secondarySchool.id, teacherProfileId: tpSec2.id, reportedByUserId: secondaryAdmin.id, reason: 'Medical appointment',                  date: daysAgo(3),  status: 'PENDING' },
    ],
    skipDuplicates: true,
  });

  // ── 20. Support Tickets ───────────────────────────────
  console.log('  ➤ Seeding Support Tickets...');
  // Use findFirst + create pattern to avoid duplicates on subject
  let ticket1 = await prisma.supportTicket.findFirst({ where: { schoolId: primarySchool.id, subject: 'Cannot export student reports to PDF' } });
  if (!ticket1) {
    ticket1 = await prisma.supportTicket.create({
      data: { schoolId: primarySchool.id, subject: 'Cannot export student reports to PDF', priority: 'HIGH', status: 'IN_PROGRESS' },
    });
  }
  let ticket2 = await prisma.supportTicket.findFirst({ where: { schoolId: secondarySchool.id, subject: 'Request to add a new fee category for exam fees' } });
  if (!ticket2) {
    ticket2 = await prisma.supportTicket.create({
      data: { schoolId: secondarySchool.id, subject: 'Request to add a new fee category for exam fees', priority: 'MEDIUM', status: 'OPEN' },
    });
  }

  // Ticket replies (only add if ticket has no replies yet)
  const t1Replies = await prisma.ticketReply.count({ where: { ticketId: ticket1.id } });
  if (t1Replies === 0) {
    await prisma.ticketReply.createMany({
      data: [
        { ticketId: ticket1.id, authorType: 'SCHOOL',         authorId: primaryAdmin.id,   body: 'When I click "Export PDF" on the student reports page, the button loads but nothing downloads. Tried Chrome and Firefox.' },
        { ticketId: ticket1.id, authorType: 'PLATFORM_ADMIN', authorId: supportAgent.id,   body: 'Thank you for reporting this. We have identified the issue and a fix is being deployed. Please try again in 24 hours.' },
      ],
    });
  }
  const t2Replies = await prisma.ticketReply.count({ where: { ticketId: ticket2.id } });
  if (t2Replies === 0) {
    await prisma.ticketReply.createMany({
      data: [
        { ticketId: ticket2.id, authorType: 'SCHOOL', authorId: secondaryAdmin.id, body: 'We need to add "Exam Fees" as a separate category so parents can see it broken down on receipts.' },
      ],
    });
  }

  // ── 21. Invoices & Payment Transactions ───────────────
  console.log('  ➤ Seeding Invoices...');
  const inv1 = await prisma.invoice.upsert({
    where: { schoolId_period: { schoolId: primarySchool.id, period: '2026-03' } },
    update: {},
    create: { schoolId: primarySchool.id, period: '2026-03', amount: 900000, dueDate: new Date('2026-03-31'), status: 'PAID', paidAt: new Date('2026-03-20') },
  });
  await prisma.invoice.upsert({
    where: { schoolId_period: { schoolId: secondarySchool.id, period: '2026-03' } },
    update: {},
    create: { schoolId: secondarySchool.id, period: '2026-03', amount: 1550000, dueDate: new Date('2026-03-31'), status: 'PENDING' },
  });

  // Payment transaction for the paid invoice
  const existingTxn = await prisma.paymentTransaction.findFirst({ where: { invoiceId: inv1.id } });
  if (!existingTxn) {
    const merchantRef = `em-${Date.now()}`;
    await prisma.paymentTransaction.create({
      data: {
        invoiceId: inv1.id, schoolId: primarySchool.id, merchantReference: merchantRef,
        orderTrackingId: `PT-${Date.now()}`, currency: 'UGX', amount: 900000,
        status: 'COMPLETED', statusCode: 1, paymentMethod: 'MTN Mobile Money',
        confirmationCode: `CONF-${Date.now()}`, paymentAccount: '07XX-XXX-400',
        description: 'Platform subscription — March 2026', completedAt: new Date('2026-03-20'),
      },
    });
  }

  // ── 22. School Alerts ─────────────────────────────────
  console.log('  ➤ Seeding School Alerts...');
  const alertCount = await prisma.schoolAlert.count({ where: { schoolId: { in: [primarySchool.id, secondarySchool.id] } } });
  if (alertCount === 0) {
    await prisma.schoolAlert.createMany({
      data: [
        { schoolId: primarySchool.id,   sentByUserId: primaryAdmin.id,   channel: 'SMS',       audience: 'All Parents',  message: 'Reminder: Term 1 fees balance is due by end of March. Please clear all outstanding balances.',   recipientCount: 180 },
        { schoolId: primarySchool.id,   sentByUserId: primaryAdmin.id,   channel: 'EMAIL',     audience: 'All Teachers', message: 'Staff meeting this Friday at 3:30 PM in the main hall. Attendance is mandatory.',                 recipientCount: 15 },
        { schoolId: primarySchool.id,   sentByUserId: primaryAdmin.id,   channel: 'APP',       audience: 'Class:P1',     message: 'P1 parents: Parent-teacher conference scheduled for next Wednesday at 2:00 PM.',                  recipientCount: 32 },
        { schoolId: secondarySchool.id, sentByUserId: secondaryAdmin.id, channel: 'SMS',       audience: 'All Parents',  message: 'Mid-term exams start next Monday. Please ensure your child is well prepared.',                    recipientCount: 240 },
        { schoolId: secondarySchool.id, sentByUserId: secondaryAdmin.id, channel: 'EMERGENCY', audience: 'All Parents',  message: 'School closing early today at 1:00 PM due to water supply disruption. Please arrange pick-up.',   recipientCount: 310 },
      ],
    });
  }

  // ── 23. Email Logs ────────────────────────────────────
  console.log('  ➤ Seeding Email Logs...');
  const emailCount = await prisma.emailLog.count();
  if (emailCount === 0) {
    await prisma.emailLog.createMany({
      data: [
        { type: 'SCHOOL_APPROVED', recipient: 'admin@kampalaprimary.ac.ug', subject: 'Your school registration has been approved!', status: 'SENT' },
        { type: 'SCHOOL_APPROVED', recipient: 'admin@jinjasecondary.ac.ug', subject: 'Your school registration has been approved!', status: 'SENT' },
        { type: 'PASSWORD_RESET',  recipient: 'john.mukasa@kampalaprimary.ac.ug', subject: 'Password Reset Request',                status: 'SENT' },
        { type: 'FEE_REMINDER',    recipient: 'robert.kizza@gmail.com',     subject: 'Fee Reminder — Term 1 2026',                  status: 'SENT' },
        { type: 'INVOICE',         recipient: 'admin@jinjasecondary.ac.ug', subject: 'Platform Invoice — March 2026',               status: 'FAILED', error: 'SMTP connection timeout' },
      ],
    });
  }

  // ── 24. Emergency Audit Logs ──────────────────────────
  console.log('  ➤ Seeding Emergency Audit Logs...');
  const auditCount = await prisma.emergencyAuditLog.count();
  if (auditCount === 0) {
    await prisma.emergencyAuditLog.createMany({
      data: [
        { action: 'SCHOOL_SUSPENDED',        performedById: superAdmin.id, performedByName: 'Admin Platform', reason: 'Test suspension — reverted immediately', metadata: { schoolId: 'test', duration: '5 minutes' } },
        { action: 'MAINTENANCE_MODE_ENABLED', performedById: superAdmin.id, performedByName: 'Admin Platform', reason: 'Database migration',                   metadata: { estimatedDuration: '30 minutes' } },
      ],
    });
  }

  // ── Done ──────────────────────────────────────────────
  console.log('\n✅ Full database seed completed successfully!\n');
  console.log('  ┌─────────────────────────────────────────────────────────────┐');
  console.log('  │  LOGIN CREDENTIALS (all accounts use the same password)    │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  Password: Password123!                                    │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  PLATFORM ADMINS                                           │');
  console.log('  │    Super Admin:   bibmarley843@gmail.com                    │');
  console.log('  │    Finance Admin: finance@edumanage.com                     │');
  console.log('  │    Support Agent: support@edumanage.com                     │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  PRIMARY SCHOOL (kampala.localhost:5173)                    │');
  console.log('  │    School Admin:  primaryadmin                              │');
  console.log('  │    Teacher:       jmukasa / ratim / pssemakula             │');
  console.log('  │    Student:       dkizza / gnamutebi / mlubega             │');
  console.log('  │    Parent:        rkizza / bnamutebi / glubega             │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  SECONDARY SCHOOL (jinja.localhost:5173)                   │');
  console.log('  │    School Admin:  secondaryadmin                            │');
  console.log('  │    Teacher:       awamala / cokello / dnabirye             │');
  console.log('  │    Student:       bwafula / inakamya / smuwanga            │');
  console.log('  │    Parent:        fwafula / mnakamya / jmuwanga            │');
  console.log('  └─────────────────────────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
