-- CreateEnum
CREATE TYPE "SchoolLevel" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "SchoolStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PlatformAdminRole" AS ENUM ('SUPER_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_AGENT', 'CONTENT_MANAGER');

-- CreateEnum
CREATE TYPE "PlatformAdminStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SCHOOLADMIN_PRIMARY', 'SCHOOLADMIN_SECONDARY', 'TEACHER', 'STUDENT', 'PARENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "ResetOwnerType" AS ENUM ('PLATFORM_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ApiKeyStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "TicketAuthorType" AS ENUM ('PLATFORM_ADMIN', 'SCHOOL');

-- CreateEnum
CREATE TYPE "PaymentTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED', 'INVALID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IpnProcessingStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'PROMOTED', 'REPEATING', 'GRADUATED', 'TRANSFERRED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "FeeCategory" AS ENUM ('TUITION', 'LUNCH', 'ACTIVITIES', 'OTHER');

-- CreateEnum
CREATE TYPE "FeePaymentStatus" AS ENUM ('PAID', 'PARTIAL', 'OVERDUE');

-- CreateEnum
CREATE TYPE "AlertChannel" AS ENUM ('SMS', 'EMAIL', 'APP', 'EMERGENCY');

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "SchoolLevel" NOT NULL,
    "subdomain" TEXT NOT NULL,
    "physicalAddress" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "website" TEXT,
    "numStudentsDeclared" INTEGER NOT NULL,
    "licenseFileUrl" TEXT,
    "status" "SchoolStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "pricePerStudent" INTEGER NOT NULL DEFAULT 2000,
    "motto" TEXT,
    "currentTerm" TEXT,
    "termStart" TIMESTAMP(3),
    "termEnd" TIMESTAMP(3),
    "notificationSettings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_documents" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "PlatformAdminRole" NOT NULL DEFAULT 'SUPPORT_AGENT',
    "status" "PlatformAdminStatus" NOT NULL DEFAULT 'ACTIVE',
    "recoveryEmail" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT,
    "studentCode" TEXT,
    "passwordHash" TEXT NOT NULL,
    "recoveryEmail" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "ownerType" "ResetOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_config" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_config_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_replies" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorType" "TicketAuthorType" NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "status" "ApiKeyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdById" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedById" TEXT NOT NULL,
    "performedByName" TEXT NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "merchantReference" TEXT NOT NULL,
    "orderTrackingId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "amount" INTEGER NOT NULL,
    "status" "PaymentTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "statusCode" INTEGER,
    "paymentMethod" TEXT,
    "confirmationCode" TEXT,
    "paymentAccount" TEXT,
    "description" TEXT NOT NULL,
    "redirectUrl" TEXT,
    "rawSubmitResponse" JSONB,
    "rawStatusResponse" JSONB,
    "refundRequestedAt" TIMESTAMP(3),
    "refundStatus" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesapal_ipn_events" (
    "id" TEXT NOT NULL,
    "paymentTransactionId" TEXT,
    "orderTrackingId" TEXT NOT NULL,
    "orderMerchantReference" TEXT NOT NULL,
    "orderNotificationType" TEXT NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "processingStatus" "IpnProcessingStatus" NOT NULL DEFAULT 'RECEIVED',
    "responseStatusSent" INTEGER,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "pesapal_ipn_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "ownerType" "ResetOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "schoolId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_classes" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tier" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_class_streams" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_class_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_subjects" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "class_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subjectSpecialization" TEXT,
    "status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "leaveReason" TEXT,
    "leaveStart" TIMESTAMP(3),
    "leaveEnd" TIMESTAMP(3),
    "leaveNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teacher_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_class_subjects" (
    "id" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT,

    CONSTRAINT "teacher_class_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_absence_reports" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "reportedByUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_absence_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT,
    "studentCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "classId" TEXT NOT NULL,
    "streamId" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "admittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "inactiveReason" TEXT,
    "inactiveReturn" TIMESTAMP(3),
    "inactiveNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_parents" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'Parent/Guardian',

    CONSTRAINT "student_parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "markedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timetable_entries" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "streamId" TEXT,
    "dayOfWeek" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "subjectId" TEXT,
    "teacherProfileId" TEXT,
    "room" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timetable_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_fee_structures" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "tuition" INTEGER NOT NULL DEFAULT 0,
    "lunch" INTEGER NOT NULL DEFAULT 0,
    "activities" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_fee_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_payments" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT,
    "recordedByUserId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_alerts" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "sentByUserId" TEXT NOT NULL,
    "channel" "AlertChannel" NOT NULL,
    "audience" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "school_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schools_subdomain_key" ON "schools"("subdomain");

-- CreateIndex
CREATE INDEX "schools_level_idx" ON "schools"("level");

-- CreateIndex
CREATE INDEX "schools_district_idx" ON "schools"("district");

-- CreateIndex
CREATE INDEX "schools_status_level_idx" ON "schools"("status", "level");

-- CreateIndex
CREATE INDEX "school_documents_schoolId_idx" ON "school_documents"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_admins_email_key" ON "platform_admins"("email");

-- CreateIndex
CREATE INDEX "users_schoolId_role_idx" ON "users"("schoolId", "role");

-- CreateIndex
CREATE INDEX "users_schoolId_status_idx" ON "users"("schoolId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_schoolId_email_key" ON "users"("schoolId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_schoolId_username_key" ON "users"("schoolId", "username");

-- CreateIndex
CREATE UNIQUE INDEX "users_schoolId_studentCode_key" ON "users"("schoolId", "studentCode");

-- CreateIndex
CREATE INDEX "password_reset_tokens_ownerType_ownerId_idx" ON "password_reset_tokens"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "email_logs_type_idx" ON "email_logs"("type");

-- CreateIndex
CREATE INDEX "email_logs_recipient_idx" ON "email_logs"("recipient");

-- CreateIndex
CREATE INDEX "email_logs_status_createdAt_idx" ON "email_logs"("status", "createdAt");

-- CreateIndex
CREATE INDEX "support_tickets_schoolId_idx" ON "support_tickets"("schoolId");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_createdAt_idx" ON "support_tickets"("createdAt");

-- CreateIndex
CREATE INDEX "ticket_replies_ticketId_idx" ON "ticket_replies"("ticketId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_status_dueDate_idx" ON "invoices"("status", "dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_schoolId_period_key" ON "invoices"("schoolId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");

-- CreateIndex
CREATE INDEX "emergency_audit_logs_createdAt_idx" ON "emergency_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "emergency_audit_logs_action_idx" ON "emergency_audit_logs"("action");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_merchantReference_key" ON "payment_transactions"("merchantReference");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_orderTrackingId_key" ON "payment_transactions"("orderTrackingId");

-- CreateIndex
CREATE INDEX "payment_transactions_schoolId_idx" ON "payment_transactions"("schoolId");

-- CreateIndex
CREATE INDEX "payment_transactions_status_idx" ON "payment_transactions"("status");

-- CreateIndex
CREATE INDEX "pesapal_ipn_events_orderTrackingId_idx" ON "pesapal_ipn_events"("orderTrackingId");

-- CreateIndex
CREATE INDEX "pesapal_ipn_events_paymentTransactionId_idx" ON "pesapal_ipn_events"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_ownerType_ownerId_idx" ON "refresh_tokens"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "refresh_tokens_revokedAt_expiresAt_idx" ON "refresh_tokens"("revokedAt", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_schoolId_name_key" ON "subjects"("schoolId", "name");

-- CreateIndex
CREATE INDEX "school_classes_schoolId_order_idx" ON "school_classes"("schoolId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "school_classes_schoolId_name_key" ON "school_classes"("schoolId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "school_class_streams_classId_name_key" ON "school_class_streams"("classId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "class_subjects_classId_subjectId_key" ON "class_subjects"("classId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_profiles_userId_key" ON "teacher_profiles"("userId");

-- CreateIndex
CREATE INDEX "teacher_profiles_schoolId_status_idx" ON "teacher_profiles"("schoolId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_class_subjects_teacherProfileId_classId_subjectId_key" ON "teacher_class_subjects"("teacherProfileId", "classId", "subjectId");

-- CreateIndex
CREATE INDEX "teacher_absence_reports_schoolId_status_idx" ON "teacher_absence_reports"("schoolId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE INDEX "students_schoolId_classId_idx" ON "students"("schoolId", "classId");

-- CreateIndex
CREATE INDEX "students_schoolId_status_idx" ON "students"("schoolId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "students_schoolId_studentCode_key" ON "students"("schoolId", "studentCode");

-- CreateIndex
CREATE UNIQUE INDEX "parents_userId_key" ON "parents"("userId");

-- CreateIndex
CREATE INDEX "parents_schoolId_status_idx" ON "parents"("schoolId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "student_parents_studentId_parentId_key" ON "student_parents"("studentId", "parentId");

-- CreateIndex
CREATE INDEX "attendance_records_schoolId_classId_date_idx" ON "attendance_records"("schoolId", "classId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_studentId_date_key" ON "attendance_records"("studentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "timetable_entries_classId_streamId_dayOfWeek_timeSlot_key" ON "timetable_entries"("classId", "streamId", "dayOfWeek", "timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "class_fee_structures_classId_key" ON "class_fee_structures"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_payments_receiptNumber_key" ON "student_fee_payments"("receiptNumber");

-- CreateIndex
CREATE INDEX "student_fee_payments_schoolId_studentId_term_idx" ON "student_fee_payments"("schoolId", "studentId", "term");

-- CreateIndex
CREATE INDEX "school_alerts_schoolId_idx" ON "school_alerts"("schoolId");

-- AddForeignKey
ALTER TABLE "school_documents" ADD CONSTRAINT "school_documents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesapal_ipn_events" ADD CONSTRAINT "pesapal_ipn_events_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "payment_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_classes" ADD CONSTRAINT "school_classes_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_class_streams" ADD CONSTRAINT "school_class_streams_classId_fkey" FOREIGN KEY ("classId") REFERENCES "school_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_classId_fkey" FOREIGN KEY ("classId") REFERENCES "school_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_class_subjects" ADD CONSTRAINT "teacher_class_subjects_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_absence_reports" ADD CONSTRAINT "teacher_absence_reports_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "school_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "school_class_streams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_parents" ADD CONSTRAINT "student_parents_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_classId_fkey" FOREIGN KEY ("classId") REFERENCES "school_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "school_class_streams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "timetable_entries_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teacher_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_fee_structures" ADD CONSTRAINT "class_fee_structures_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_fee_structures" ADD CONSTRAINT "class_fee_structures_classId_fkey" FOREIGN KEY ("classId") REFERENCES "school_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_payments" ADD CONSTRAINT "student_fee_payments_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_payments" ADD CONSTRAINT "student_fee_payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_alerts" ADD CONSTRAINT "school_alerts_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
