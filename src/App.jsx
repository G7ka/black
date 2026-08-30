import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isMainDomain } from './utils/tenant'

// Super Admin
import SAHome from './pages/superadmin/SAHome'
import SASchools from './pages/superadmin/SASchools'
import SASubscriptions from './pages/superadmin/SASubscriptions'
import SAAnalytics from './pages/superadmin/SAAnalytics'
import SAUsers from './pages/superadmin/SAUsers'
import SASupport from './pages/superadmin/SASupport'
import SAConfiguration from './pages/superadmin/SAConfiguration'
import SAMonitoring from './pages/superadmin/SAMonitoring'
import SADeveloperTools from './pages/superadmin/SADeveloperTools'
import SAEmergency from './pages/superadmin/SAEmergency'

// Primary Admin
import SchoolAdminHome from './pages/schooladmin/SchoolAdminHome'
import SchoolAdminTeachers from './pages/schooladmin/SchoolAdminTeachers'
import SchoolAdminStudents from './pages/schooladmin/SchoolAdminStudents'
import SchoolAdminFees from './pages/schooladmin/SchoolAdminFees'
import SchoolAdminParents from './pages/schooladmin/SchoolAdminParents'
import SchoolAdminClasses from './pages/schooladmin/SchoolAdminClasses'
import SchoolAdminTimetable from './pages/schooladmin/SchoolAdminTimetable'
import SchoolAdminConfiguration from './pages/schooladmin/SchoolAdminConfiguration'
import SchoolAdminReports from './pages/schooladmin/SchoolAdminReports'
import SchoolAdminAttendance from './pages/schooladmin/SchoolAdminAttendance'

// Secondary Admin
import SecondaryAdminHome from './pages/schooladmin/SecondaryAdminHome'
import SecondaryAdminTeachers from './pages/schooladmin/SecondaryAdminTeachers'
import SecondaryAdminStudents from './pages/schooladmin/SecondaryAdminStudents'
import SecondaryAdminParents from './pages/schooladmin/SecondaryAdminParents'
import SecondaryAdminClasses from './pages/schooladmin/SecondaryAdminClasses'
import SecondaryAdminTimetable from './pages/schooladmin/SecondaryAdminTimetable'

// Teacher
import TeacherHome from './pages/teacher/TeacherHome'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherGrades from './pages/teacher/TeacherGrades'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherProfile from './pages/teacher/TeacherProfile'
import TeacherSupport from './pages/teacher/TeacherSupport'

// Student
import StudentHome from './pages/student/StudentHome'
import StudentGrades from './pages/student/StudentGrades'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentAssignments from './pages/student/StudentAssignments'
import StudentMessages from './pages/student/StudentMessages'
import StudentProfile from './pages/student/StudentProfile'

// Parent
import ParentHome from './pages/parent/ParentHome'
import ParentGrades from './pages/parent/ParentGrades'
import ParentAttendance from './pages/parent/ParentAttendance'
import ParentFees from './pages/parent/ParentFees'
import ParentMessages from './pages/parent/ParentMessages'
import ParentNotifications from './pages/parent/ParentNotifications'
import ParentProfile from './pages/parent/ParentProfile'
import ParentAiChat from './pages/parent/ParentAiChat'

// Landing & Auth
import Landing from './pages/Landing'
import SchoolRegistration from './pages/auth/SchoolRegistration'
import MainLogin from './pages/auth/MainLogin'
import TenantLogin from './pages/auth/TenantLogin'
import ForgotPassword from './pages/auth/ForgotPassword'

// School Admin Support
import SchoolAdminSupport from './pages/schooladmin/SchoolAdminSupport'

// Shared
import SettingsPage from './pages/shared/SettingsPage'
import AdminAiAssistant from './pages/shared/AdminAiAssistant'

// Smart Root Route: Renders TenantLogin on subdomains or ?tenant=..., otherwise renders main Landing page
function RootRoute() {
    const main = isMainDomain();
    if (!main) {
        return <TenantLogin />;
    }
    return <Landing />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Dynamic Root Route */}
                <Route path="/" element={<RootRoute />} />

                {/* Public & Auth Pages */}
                <Route path="/register" element={<SchoolRegistration />} />
                <Route path="/login" element={<MainLogin />} />
                <Route path="/TenantLogin" element={<TenantLogin />} />
                <Route path="/admin" element={<MainLogin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Parent Portal */}
                <Route path="/parent" element={<ParentHome />} />
                <Route path="/parent/ai-chat" element={<ParentAiChat />} />
                <Route path="/parent/grades" element={<ParentGrades />} />
                <Route path="/parent/attendance" element={<ParentAttendance />} />
                <Route path="/parent/fees" element={<ParentFees />} />
                <Route path="/parent/messages" element={<ParentMessages />} />
                <Route path="/parent/notifications" element={<ParentNotifications />} />
                <Route path="/parent/profile" element={<ParentProfile />} />
                <Route path="/parent/settings" element={<SettingsPage role="parent" />} />

                {/* Teacher Portal */}
                <Route path="/teacher" element={<TeacherHome />} />
                <Route path="/teacher/students" element={<TeacherStudents />} />
                <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                <Route path="/teacher/grades" element={<TeacherGrades />} />
                <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                <Route path="/teacher/profile" element={<TeacherProfile />} />
                <Route path="/teacher/support" element={<TeacherSupport />} />
                <Route path="/teacher/settings" element={<SettingsPage role="teacher" />} />

                {/* Student Portal */}
                <Route path="/student" element={<StudentHome />} />
                <Route path="/student/grades" element={<StudentGrades />} />
                <Route path="/student/attendance" element={<StudentAttendance />} />
                <Route path="/student/assignments" element={<StudentAssignments />} />
                <Route path="/student/messages" element={<StudentMessages />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/settings" element={<SettingsPage role="student" />} />

                {/* Primary School Admin */}
                <Route path="/schooladmin/primary" element={<SchoolAdminHome />} />
                <Route path="/schooladmin/primary/ai-assistant" element={<AdminAiAssistant role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/timetable" element={<SchoolAdminTimetable />} />
                <Route path="/schooladmin/primary/teachers" element={<SchoolAdminTeachers />} />
                <Route path="/schooladmin/primary/students" element={<SchoolAdminStudents />} />
                <Route path="/schooladmin/primary/fees" element={<SchoolAdminFees section="fees" role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/payments" element={<SchoolAdminFees section="payments" role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/parents" element={<SchoolAdminParents role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/classes" element={<SchoolAdminClasses />} />
                <Route path="/schooladmin/primary/attendance" element={<SchoolAdminAttendance role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/reports" element={<SchoolAdminReports role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/configuration" element={<SchoolAdminConfiguration role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/support" element={<SchoolAdminSupport role="schooladmin-primary" />} />
                <Route path="/schooladmin/primary/settings" element={<SettingsPage role="schooladmin-primary" />} />

                {/* Secondary School Admin */}
                <Route path="/schooladmin/secondary" element={<SecondaryAdminHome />} />
                <Route path="/schooladmin/secondary/ai-assistant" element={<AdminAiAssistant role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/timetable" element={<SecondaryAdminTimetable />} />
                <Route path="/schooladmin/secondary/teachers" element={<SecondaryAdminTeachers />} />
                <Route path="/schooladmin/secondary/students" element={<SecondaryAdminStudents />} />
                <Route path="/schooladmin/secondary/fees" element={<SchoolAdminFees section="fees" role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/payments" element={<SchoolAdminFees section="payments" role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/parents" element={<SchoolAdminParents role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/classes" element={<SecondaryAdminClasses />} />
                <Route path="/schooladmin/secondary/attendance" element={<SchoolAdminAttendance role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/reports" element={<SchoolAdminReports role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/configuration" element={<SchoolAdminConfiguration role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/support" element={<SchoolAdminSupport role="schooladmin-secondary" />} />
                <Route path="/schooladmin/secondary/settings" element={<SettingsPage role="schooladmin-secondary" />} />

                {/* Super Admin */}
                <Route path="/superadmin" element={<SAHome />} />
                <Route path="/superadmin/ai-assistant" element={<AdminAiAssistant role="superadmin" />} />
                <Route path="/superadmin/ai" element={<Navigate to="/superadmin/ai-assistant" replace />} />
                <Route path="/superadmin/schools" element={<SASchools />} />
                <Route path="/superadmin/subscriptions" element={<SASubscriptions />} />
                <Route path="/superadmin/analytics" element={<SAAnalytics />} />
                <Route path="/superadmin/users" element={<SAUsers />} />
                <Route path="/superadmin/support" element={<SASupport />} />
                <Route path="/superadmin/configuration" element={<SAConfiguration />} />
                <Route path="/superadmin/monitoring" element={<SAMonitoring />} />
                <Route path="/superadmin/devtools" element={<SADeveloperTools />} />
                <Route path="/superadmin/emergency" element={<SAEmergency />} />

                {/* Convenient Aliases to prevent 404 Landing Page fallbacks */}
                <Route path="/schooladmin" element={<Navigate to="/schooladmin/primary" replace />} />
                <Route path="/schooladmin/ai-assistant" element={<Navigate to="/schooladmin/secondary/ai-assistant" replace />} />
                <Route path="/schooladmin/ai" element={<Navigate to="/schooladmin/secondary/ai-assistant" replace />} />
                <Route path="/schooladmin/students" element={<Navigate to="/schooladmin/secondary/students" replace />} />
                <Route path="/schooladmin/teachers" element={<Navigate to="/schooladmin/secondary/teachers" replace />} />
                <Route path="/schooladmin/fees" element={<Navigate to="/schooladmin/secondary/fees" replace />} />
                <Route path="/schooladmin/reports" element={<Navigate to="/schooladmin/secondary/reports" replace />} />
                <Route path="/schooladmin/timetable" element={<Navigate to="/schooladmin/secondary/timetable" replace />} />
                <Route path="/schooladmin/attendance" element={<Navigate to="/schooladmin/secondary/attendance" replace />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
