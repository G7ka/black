import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
    Menu, X, Bell, ChevronDown, LogOut, User,
    Home, Users, BookOpen, ClipboardList, BarChart3,
    Settings, LifeBuoy, Monitor, TrendingUp,
    Code2, Megaphone, AlertTriangle, CreditCard,
    GraduationCap, CalendarDays, FileText, School,
    Building2, DollarSign, Award, Sliders
} from 'lucide-react'

const navConfigs = {
    superadmin: [
        { label: 'Overview', icon: Home, path: '/superadmin', home: true },
        { label: 'Schools', icon: Building2, path: '/superadmin/schools' },
        { label: 'Subscriptions', icon: CreditCard, path: '/superadmin/subscriptions' },
        { label: 'Analytics', icon: BarChart3, path: '/superadmin/analytics' },
        { label: 'Users', icon: Users, path: '/superadmin/users' },
        { label: 'Support', icon: LifeBuoy, path: '/superadmin/support' },
        { label: 'Configuration', icon: Sliders, path: '/superadmin/configuration' },
        { label: 'Monitoring', icon: Monitor, path: '/superadmin/monitoring' },
        { label: 'Business Intel', icon: TrendingUp, path: '/superadmin/bi' },
        { label: 'Dev Tools', icon: Code2, path: '/superadmin/devtools' },
        { label: 'Marketing', icon: Megaphone, path: '/superadmin/marketing' },
        { label: 'Emergency', icon: AlertTriangle, path: '/superadmin/emergency' },
    ],
    'schooladmin-primary': [
        { label: 'Overview', icon: Home, path: '/schooladmin/primary', home: true },
        { label: 'Timetable', icon: CalendarDays, path: '/schooladmin/primary/timetable' },
        { label: 'Teachers', icon: Users, path: '/schooladmin/primary/teachers' },
        { label: 'Students', icon: GraduationCap, path: '/schooladmin/primary/students' },
        { label: 'Parents', icon: User, path: '/schooladmin/primary/parents' },
        { label: 'Classes', icon: School, path: '/schooladmin/primary/classes' },
        { label: 'Attendance', icon: CalendarDays, path: '/schooladmin/primary/attendance' },
        { label: 'Fee Structure', icon: CreditCard, path: '/schooladmin/primary/fees' },
        { label: 'Payments', icon: BarChart3, path: '/schooladmin/primary/payments' },
        { label: 'Reports', icon: FileText, path: '/schooladmin/primary/reports' },
        { label: 'Configuration', icon: Sliders, path: '/schooladmin/primary/configuration' },
        { label: 'Support', icon: LifeBuoy, path: '/schooladmin/primary/support' },
        { label: 'Settings', icon: Settings, path: '/schooladmin/primary/settings' },
    ],
    'schooladmin-secondary': [
        { label: 'Overview', icon: Home, path: '/schooladmin/secondary', home: true },
        { label: 'Timetable', icon: CalendarDays, path: '/schooladmin/secondary/timetable' },
        { label: 'Teachers', icon: Users, path: '/schooladmin/secondary/teachers' },
        { label: 'Students', icon: GraduationCap, path: '/schooladmin/secondary/students' },
        { label: 'Parents', icon: User, path: '/schooladmin/secondary/parents' },
        { label: 'Classes', icon: Building2, path: '/schooladmin/secondary/classes' },
        { label: 'Attendance', icon: CalendarDays, path: '/schooladmin/secondary/attendance' },
        { label: 'Fee Structure', icon: CreditCard, path: '/schooladmin/secondary/fees' },
        { label: 'Payments', icon: BarChart3, path: '/schooladmin/secondary/payments' },
        { label: 'Reports', icon: FileText, path: '/schooladmin/secondary/reports' },
        { label: 'Configuration', icon: Sliders, path: '/schooladmin/secondary/configuration' },
        { label: 'Support', icon: LifeBuoy, path: '/schooladmin/secondary/support' },
        { label: 'Settings', icon: Settings, path: '/schooladmin/secondary/settings' },
    ],
    teacher: [
        { label: 'Home', icon: Home, path: '/teacher', home: true },
        { label: 'Students', icon: GraduationCap, path: '/teacher/students' },
        { label: 'Attendance', icon: CalendarDays, path: '/teacher/attendance' },
        { label: 'Grades', icon: BookOpen, path: '/teacher/grades' },
        { label: 'Assignments', icon: ClipboardList, path: '/teacher/assignments' },
        { label: 'Profile', icon: User, path: '/teacher/profile' },
        { label: 'Support', icon: LifeBuoy, path: '/teacher/support' },
        { label: 'Settings', icon: Settings, path: '/teacher/settings' },
    ],
    student: [
        { label: 'Dashboard', icon: Home, path: '/student', home: true },
        { label: 'Grades', icon: Award, path: '/student/grades' },
        { label: 'Attendance', icon: CalendarDays, path: '/student/attendance' },
        { label: 'Assignments', icon: ClipboardList, path: '/student/assignments' },
        { label: 'Teachers', icon: Users, path: '/student/messages' },
        { label: 'Profile', icon: User, path: '/student/profile' },
        { label: 'Settings', icon: Settings, path: '/student/settings' },
    ],
    parent: [
        { label: 'Dashboard', icon: Home, path: '/parent', home: true },
        { label: 'Grades', icon: Award, path: '/parent/grades' },
        { label: 'Attendance', icon: CalendarDays, path: '/parent/attendance' },
        { label: 'Fees', icon: DollarSign, path: '/parent/fees' },
        { label: 'Teachers', icon: Users, path: '/parent/messages' },
        { label: 'Profile', icon: User, path: '/parent/profile' },
        { label: 'Notifications', icon: Bell, path: '/parent/notifications' },
        { label: 'Settings', icon: Settings, path: '/parent/settings' },
    ],
}

const roleLabels = {
    superadmin: 'Super Admin',
    'schooladmin-primary': 'Primary Admin',
    'schooladmin-secondary': 'Secondary Admin',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
}

const roleAvatars = {
    teacher: 'https://randomuser.me/api/portraits/men/32.jpg',
    student: 'https://randomuser.me/api/portraits/men/12.jpg',
    parent: 'https://randomuser.me/api/portraits/women/68.jpg',
}

const roleAvatarColors = {
    superadmin: 'from-violet-500 to-purple-700',
    'schooladmin-primary': 'from-blue-500 to-blue-700',
    'schooladmin-secondary': 'from-indigo-500 to-indigo-700',
    teacher: 'from-emerald-500 to-teal-700',
    student: 'from-sky-400 to-cyan-600',
    parent: 'from-orange-400 to-amber-600',
}

export default function DashboardLayout({ role, children }) {
    // drawerOpen controls the single slide-in sidebar (same on all screen sizes)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const navItems = navConfigs[role] || navConfigs.teacher

    // Initialize dark mode from localStorage
    useEffect(() => {
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark')
        }
    }, [])

    // Close drawer on any route change
    useEffect(() => {
        setDrawerOpen(false)
    }, [location.pathname])

    const closeDrawer = () => setDrawerOpen(false)

    const userName = role === 'superadmin' ? 'Admin Platform'
        : role === 'schooladmin-primary' ? 'Kampala Primary'
            : role === 'schooladmin-secondary' ? 'Kampala Secondary'
                : role === 'teacher' ? 'Mr. Kenneth Okello'
                    : role === 'student' ? 'Ivan Namukasa'
                        : 'Mary Namukasa'

    const userTitle = roleLabels[role] || 'User'

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">

            {/* ── Dark overlay (shown when drawer is open) ── */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 transition-all duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeDrawer}
            />

            {/* ── Sidebar drawer ── modern floating glassmorphism design ── */}
            <aside
                className={`fixed top-3 bottom-3 left-3 z-40 w-[280px] flex flex-col rounded-[2rem] shadow-2xl shadow-blue-900/20 border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${drawerOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'}`}
            >
                {/* Header / Logo */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-gray-900 dark:text-white font-bold text-sm leading-tight">EduManage</p>
                            <p className="text-blue-600 dark:text-blue-400 text-xs">Uganda SMS</p>
                        </div>
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-900 dark:text-white/70 dark:hover:text-white"
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mx-4 mt-4 mb-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Current Role</p>
                    <p className="text-gray-900 dark:text-white text-sm font-semibold mt-0.5">{roleLabels[role]}</p>
                </div>

                {/* Nav links — each click closes the drawer */}
                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={!!item.home}
                            onClick={closeDrawer}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'active' : ''}`
                            }
                        >
                            <item.icon size={18} className="flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Header — always visible, hamburger opens drawer */}
                <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={20} className="text-gray-600 dark:text-slate-300" />
                        </button>
                        <div>
                            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {role === 'superadmin' ? 'EduManage Platform'
                                    : role === 'schooladmin-primary' ? 'Kampala Primary School'
                                        : role === 'schooladmin-secondary' ? 'Kampala Secondary School'
                                            : role === 'teacher' ? 'Teacher Portal'
                                                : role === 'student' ? 'Student Portal'
                                                    : 'Parent Portal'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
                                {new Date().toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            <Bell size={18} className="text-gray-600 dark:text-slate-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {roleAvatars[role] ? (
                                    <img src={roleAvatars[role]} alt={userName} className="w-8 h-8 rounded-xl object-cover shadow-sm border border-gray-200 dark:border-slate-600" />
                                ) : (
                                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${roleAvatarColors[role]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                                        {userName[0]}
                                    </div>
                                )}
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{userName}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-slate-400">{userTitle}</p>
                                </div>
                                <ChevronDown size={14} className="text-gray-400 dark:text-slate-500" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{userTitle}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            // Provide default routes for profiles depending on role
                                            if (role === 'student' || role === 'teacher' || role === 'parent') {
                                                navigate(`/${role}/profile`);
                                            } else if (role.includes('schooladmin')) {
                                                navigate(`/schooladmin/${role.split('-')[1]}/configuration`);
                                            } else {
                                                navigate('/superadmin/configuration');
                                            }
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                                    >
                                        <User size={14} /> My Profile
                                    </button>

                                    <hr className="my-1 border-gray-100 dark:border-slate-700" />
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>

            {/* Close user menu when clicking outside */}
            {userMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            )}
        </div>
    )
}
