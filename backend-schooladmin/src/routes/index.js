import { Router } from 'express';
import authRoutes from './auth.routes.js';
import schoolRegistrationRoutes from './schoolRegistration.routes.js';
import schoolManagementRoutes from './schoolManagement.routes.js';
import billingRoutes from './billing.routes.js';
import platformAdminManagementRoutes from './platformAdminManagement.routes.js';
import supportTicketRoutes from './supportTicket.routes.js';
import platformConfigRoutes from './platformConfig.routes.js';
import developerToolsRoutes from './developerTools.routes.js';
import emergencyRoutes from './emergency.routes.js';
import analyticsRoutes from './analytics.routes.js';
import monitoringRoutes from './monitoring.routes.js';
import notificationRoutes from './notification.routes.js';
import paymentRoutes from './payment.routes.js';
import classesRoutes from './classes.routes.js';
import teachersRoutes from './teachers.routes.js';
import studentsRoutes from './students.routes.js';
import parentsRoutes from './parents.routes.js';
import attendanceRoutes from './attendance.routes.js';
import timetableRoutes from './timetable.routes.js';
import feesRoutes from './fees.routes.js';
import schoolConfigRoutes from './schoolConfig.routes.js';
import schoolAlertRoutes from './schoolAlert.routes.js';
import schoolReportsRoutes from './schoolReports.routes.js';
import tenantSupportRoutes from './tenantSupport.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRegistrationRoutes); // public: check-subdomain, register
router.use('/payments', paymentRoutes); // public: Pesapal IPN + status check
router.use('/admin/schools', schoolManagementRoutes); // SUPER_ADMIN: manage schools
router.use('/admin/billing', billingRoutes);
router.use('/admin/platform-admins', platformAdminManagementRoutes);
router.use('/admin/support-tickets', supportTicketRoutes);
router.use('/admin/configuration', platformConfigRoutes);
router.use('/admin/developer-tools', developerToolsRoutes);
router.use('/admin/emergency', emergencyRoutes);
router.use('/admin/analytics', analyticsRoutes);
router.use('/admin/monitoring', monitoringRoutes);
router.use('/admin/notifications', notificationRoutes);

// School Administration (tenant-side, SCHOOLADMIN_PRIMARY/SECONDARY only)
router.use('/school/classes', classesRoutes);
router.use('/school/teachers', teachersRoutes);
router.use('/school/students', studentsRoutes);
router.use('/school/parents', parentsRoutes);
router.use('/school/attendance', attendanceRoutes);
router.use('/school/timetable', timetableRoutes);
router.use('/school/fees', feesRoutes);
router.use('/school/config', schoolConfigRoutes);
router.use('/school/alerts', schoolAlertRoutes);
router.use('/school/reports', schoolReportsRoutes);
router.use('/school/support', tenantSupportRoutes);

router.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

export default router;
