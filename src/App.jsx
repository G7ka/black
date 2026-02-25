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
import SABI from './pages/superadmin/SABI'
import SADeveloperTools from './pages/superadmin/SADeveloperTools'
import SAMarketing from './pages/superadmin/SAMarketing'
import SAEmergency from './pages/superadmin/SAEmergency'

// Primary Admin
import SchoolAdminHome from './pages/schooladmin/SchoolAdminHome'
import SchoolAdminTeachers from './pages/schooladmin/SchoolAdminTeachers'
import SchoolAdminStudents from './pages/schooladmin/SchoolAdminStudents'
import SchoolAdminFees from './pages/schooladmin/SchoolAdminFees'
import SchoolAdminParents from './pages/schooladmin/SchoolAdminParents'
import SchoolAdminClasses from './pages/schooladmin/SchoolAdminClasses'

// Secondary Admin
import SecondaryAdminHome from './pages/schooladmin/SecondaryAdminHome'
import SecondaryAdminTeachers from './pages/schooladmin/SecondaryAdminTeachers'
import SecondaryAdminStudents from './pages/schooladmin/SecondaryAdminStudents'
import SecondaryAdminParents from './pages/schooladmin/SecondaryAdminParents'
import SecondaryAdminClasses from './pages/schooladmin/SecondaryAdminClasses'

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

// Landing & Auth
import Landing from './pages/Landing'
import RoleSelect from './pages/RoleSelect'
import SchoolRegistration from './pages/auth/SchoolRegistration'
import MainLogin from './pages/auth/MainLogin'
import TenantLogin from './pages/auth/TenantLogin'

export default function App() {
    const mainDomain = isMainDomain();

    if (!mainDomain) {
        // --- TENANT SUBDOMAIN ROUTES ---
        return (
            <BrowserRouter>
                <Routes>
                    {/* Tenant Public/Login Page */}
                    <Route path="/" element={<TenantLogin />} />

                    {/* School Admin */}
                    <Route path="/schooladmin/primary" element={<SchoolAdminHome />} />
                    <Route path="/schooladmin/primary/teachers" element={<SchoolAdminTeachers />} />
                    <Route path="/schooladmin/primary/students" element={<SchoolAdminStudents />} />
                    <Route path="/schooladmin/primary/fees" element={<SchoolAdminFees />} />
                    <Route path="/schooladmin/primary/payments" element={<SchoolAdminFees />} />
                    <Route path="/schooladmin/primary/parents" element={<SchoolAdminParents />} />
                    <Route path="/schooladmin/primary/classes" element={<SchoolAdminClasses />} />
                    <Route path="/schooladmin/primary/attendance" element={<SchoolAdminHome />} />
                    <Route path="/schooladmin/primary/reports" element={<SchoolAdminHome />} />
                    <Route path="/schooladmin/primary/configuration" element={<SAConfiguration />} />
                    <Route path="/schooladmin/primary/support" element={<SASupport />} />

                    <Route path="/schooladmin/secondary" element={<SecondaryAdminHome />} />
                    <Route path="/schooladmin/secondary/teachers" element={<SecondaryAdminTeachers />} />
                    <Route path="/schooladmin/secondary/students" element={<SecondaryAdminStudents />} />
                    <Route path="/schooladmin/secondary/fees" element={<SchoolAdminFees />} />
                    <Route path="/schooladmin/secondary/payments" element={<SchoolAdminFees />} />
                    <Route path="/schooladmin/secondary/parents" element={<SecondaryAdminParents />} />
                    <Route path="/schooladmin/secondary/classes" element={<SecondaryAdminClasses />} />
                    <Route path="/schooladmin/secondary/attendance" element={<SecondaryAdminHome />} />
                    <Route path="/schooladmin/secondary/reports" element={<SecondaryAdminHome />} />
                    <Route path="/schooladmin/secondary/configuration" element={<SAConfiguration />} />
                    <Route path="/schooladmin/secondary/support" element={<SASupport />} />

                    {/* Teacher */}
                    <Route path="/teacher" element={<TeacherHome />} />
                    <Route path="/teacher/students" element={<TeacherStudents />} />
                    <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                    <Route path="/teacher/grades" element={<TeacherGrades />} />
                    <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                    <Route path="/teacher/profile" element={<TeacherProfile />} />
                    <Route path="/teacher/support" element={<TeacherSupport />} />

                    {/* Student */}
                    <Route path="/student" element={<StudentHome />} />
                    <Route path="/student/grades" element={<StudentGrades />} />
                    <Route path="/student/attendance" element={<StudentAttendance />} />
                    <Route path="/student/assignments" element={<StudentAssignments />} />
                    <Route path="/student/messages" element={<StudentMessages />} />
                    <Route path="/student/profile" element={<StudentProfile />} />

                    {/* Parent */}
                    <Route path="/parent" element={<ParentHome />} />
                    <Route path="/parent/grades" element={<ParentGrades />} />
                    <Route path="/parent/attendance" element={<ParentAttendance />} />
                    <Route path="/parent/fees" element={<ParentFees />} />
                    <Route path="/parent/messages" element={<ParentMessages />} />
                    <Route path="/parent/notifications" element={<ParentNotifications />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        );
    }

    // --- MAIN DOMAIN ROUTES (edumanage.com) ---
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Main Domain Pages */}
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<SchoolRegistration />} />
                <Route path="/login" element={<MainLogin />} />
                <Route path="/demo-hub" element={<RoleSelect />} />

                {/* Super Admin */}
                <Route path="/superadmin" element={<SAHome />} />
                <Route path="/superadmin/schools" element={<SASchools />} />
                <Route path="/superadmin/subscriptions" element={<SASubscriptions />} />
                <Route path="/superadmin/analytics" element={<SAAnalytics />} />
                <Route path="/superadmin/users" element={<SAUsers />} />
                <Route path="/superadmin/support" element={<SASupport />} />
                <Route path="/superadmin/configuration" element={<SAConfiguration />} />
                <Route path="/superadmin/monitoring" element={<SAMonitoring />} />
                <Route path="/superadmin/bi" element={<SABI />} />
                <Route path="/superadmin/devtools" element={<SADeveloperTools />} />
                <Route path="/superadmin/marketing" element={<SAMarketing />} />
                <Route path="/superadmin/emergency" element={<SAEmergency />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
