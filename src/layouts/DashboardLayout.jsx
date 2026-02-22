import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    Menu, X, Bell, ChevronDown, LogOut, User,
    Home, Users, BookOpen, ClipboardList, BarChart3,
    Settings, LifeBuoy, Shield, Monitor, TrendingUp,
    Code2, Megaphone, AlertTriangle, CreditCard,
    GraduationCap, CalendarDays, FileText, School,
    Building2, MessageSquare, DollarSign, Award
} from 'lucide-react'

const navConfigs = {
    superadmin: [
        { label: 'Overview', icon: Home, path: '/superadmin' },
        { label: 'Schools', icon: Building2, path: '/superadmin/schools' },
        { label: 'Subscriptions', icon: CreditCard, path: '/superadmin/subscriptions' },
        { label: 'Analytics', icon: BarChart3, path: '/superadmin/analytics' },
        { label: 'Users', icon: Users, path: '/superadmin/users' },
        { label: 'Support', icon: LifeBuoy, path: '/superadmin/support' },
        { label: 'Configuration', icon: Settings, path: '/superadmin/configuration' },
        { label: 'Monitoring', icon: Monitor, path: '/superadmin/monitoring' },
        { label: 'Business Intel', icon: TrendingUp, path: '/superadmin/bi' },
        { label: 'Dev Tools', icon: Code2, path: '/superadmin/devtools' },
        { label: 'Marketing', icon: Megaphone, path: '/superadmin/marketing' },
        { label: 'Emergency', icon: AlertTriangle, path: '/superadmin/emergency' },
    ],
    schooladmin: [
        { label: 'Dashboard', icon: Home, path: '/schooladmin' },
        { label: 'Teachers', icon: Users, path: '/schooladmin/teachers' },
        { label: 'Students', icon: GraduationCap, path: '/schooladmin/students' },
        { label: 'Parents', icon: User, path: '/schooladmin/parents' },
        { label: 'Classes', icon: School, path: '/schooladmin/classes' },
        { label: 'Attendance', icon: CalendarDays, path: '/schooladmin/attendance' },
        { label: 'Fee Structure', icon: CreditCard, path: '/schooladmin/fees' },
        { label: 'Payments', icon: BarChart3, path: '/schooladmin/payments' },
        { label: 'Reports', icon: FileText, path: '/schooladmin/reports' },
        { label: 'Configuration', icon: Settings, path: '/schooladmin/configuration' },
        { label: 'Support', icon: LifeBuoy, path: '/schooladmin/support' },
    ],
    teacher: [
        { label: 'Home', icon: Home, path: '/teacher' },
        { label: 'Students', icon: GraduationCap, path: '/teacher/students' },
        { label: 'Attendance', icon: CalendarDays, path: '/teacher/attendance' },
        { label: 'Grades', icon: BookOpen, path: '/teacher/grades' },
        { label: 'Assignments', icon: ClipboardList, path: '/teacher/assignments' },
        { label: 'Profile', icon: User, path: '/teacher/profile' },
        { label: 'Support', icon: LifeBuoy, path: '/teacher/support' },
    ],
    student: [
        { label: 'Dashboard', icon: Home, path: '/student' },
        { label: 'Grades', icon: Award, path: '/student/grades' },
        { label: 'Attendance', icon: CalendarDays, path: '/student/attendance' },
        { label: 'Assignments', icon: ClipboardList, path: '/student/assignments' },
        { label: 'Messages', icon: MessageSquare, path: '/student/messages' },
        { label: 'Profile', icon: User, path: '/student/profile' },
    ],
    parent: [
        { label: 'Dashboard', icon: Home, path: '/parent' },
        { label: 'Grades', icon: Award, path: '/parent/grades' },
        { label: 'Attendance', icon: CalendarDays, path: '/parent/attendance' },
        { label: 'Fees', icon: DollarSign, path: '/parent/fees' },
        { label: 'Messages', icon: MessageSquare, path: '/parent/messages' },
        { label: 'Notifications', icon: Bell, path: '/parent/notifications' },
    ],
}

const roleLabels = {
    superadmin: 'Super Admin',
    schooladmin: 'School Admin',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
}

const roleAvatarColors = {
    superadmin: 'from-violet-500 to-purple-700',
    schooladmin: 'from-blue-500 to-blue-700',
    teacher: 'from-emerald-500 to-teal-700',
    student: 'from-sky-400 to-cyan-600',
    parent: 'from-orange-400 to-amber-600',
}

export default function DashboardLayout({ role, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const navigate = useNavigate()
    const navItems = navConfigs[role] || navConfigs.teacher

    const userName = role === 'superadmin' ? 'Admin Platform'
        : role === 'schooladmin' ? 'Kampala Primary'
            : role === 'teacher' ? 'Mr. Kenneth Okello'
                : role === 'student' ? 'Ivan Namukasa'
                    : 'Mary Namukasa'

    const userTitle = roleLabels[role] || 'User'

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`flex-shrink-0 flex flex-col bg-gradient-to-b from-slate-900 to-primary-950 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    {sidebarOpen && (
                        <div className="overflow-hidden">
                            <p className="text-white font-bold text-sm leading-tight">EduManage</p>
                            <p className="text-primary-400 text-xs">Uganda SMS</p>
                        </div>
                    )}
                </div>

                {/* Role badge */}
                {sidebarOpen && (
                    <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-[10px] text-primary-400 font-semibold uppercase tracking-wider">Current Role</p>
                        <p className="text-white text-sm font-semibold mt-0.5">{roleLabels[role]}</p>
                    </div>
                )}

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path.split('/').length <= 2}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                            title={item.label}
                        >
                            <item.icon size={18} className="flex-shrink-0" />
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="sidebar-link w-full justify-center"
                        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        {sidebarOpen && <span className="text-xs">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900">
                            {role === 'superadmin' ? 'EduManage Platform' : role === 'schooladmin' ? 'Kampala Primary School' : role === 'teacher' ? 'Teacher Portal' : role === 'student' ? 'Student Portal' : 'Parent Portal'}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {new Date().toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <Bell size={18} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${roleAvatarColors[role]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                    {userName[0]}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-semibold text-gray-900 leading-tight">{userName}</p>
                                    <p className="text-[10px] text-gray-500">{userTitle}</p>
                                </div>
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500">{userTitle}</p>
                                    </div>
                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <User size={14} /> My Profile
                                    </button>
                                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        <Settings size={14} /> Settings
                                    </button>
                                    <hr className="my-1 border-gray-100" />
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            {/* Overlay for user menu close */}
            {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            )}
        </div>
    )
}
