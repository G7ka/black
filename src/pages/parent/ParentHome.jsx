import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { LineChart } from '../../components/charts/Charts'
import { GraduationCap, CalendarDays, DollarSign, Award, Bell, AlertTriangle, CheckCircle, User, School, BookOpen } from 'lucide-react'

// Mock Data structure reflecting multiple kids in different school levels
const myChildren = [
    {
        id: 'child-1',
        name: 'Ivan Namukasa',
        level: 'Primary',
        school: 'Kampala Primary School',
        class: 'P6A',
        studentId: 'STU-P-001',
        photo: 'https://randomuser.me/api/portraits/men/12.jpg',
        initial: 'I',
        theme: 'from-sky-400 to-cyan-600',
        stats: { avg: 83, grade: 'A', attendance: 94, rank: 3, total: 38 },
        alerts: [
            { type: 'warning', msg: 'Late to school on Feb 17 (arrived 25 mins late)' },
            { type: 'success', msg: 'Scored 88% in the Mathematics Fractions Test!' },
            { type: 'info', msg: 'New assignment: Book Review due February 26' },
        ],
        recentGrades: [
            { subject: 'Mathematics', score: 88, grade: 'A', teacher: 'Mr. Okello', teacherPhoto: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { subject: 'English', score: 82, grade: 'B+', teacher: 'Ms. Nassali', teacherPhoto: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { subject: 'Science', score: 75, grade: 'B', teacher: 'Mr. Byaruhanga', teacherPhoto: 'https://randomuser.me/api/portraits/men/55.jpg' },
        ],
        performanceData: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [{ label: "Ivan's Average (%)", data: [75, 79, 77, 82, 84, 88], borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.1)', fill: true, tension: 0.4 }]
        }
    },
    {
        id: 'child-2',
        name: 'Mary Namukasa',
        level: 'Secondary',
        school: 'Kampala Secondary School',
        class: 'S1B',
        studentId: 'STU-S-042',
        photo: 'https://randomuser.me/api/portraits/women/22.jpg',
        initial: 'M',
        theme: 'from-fuchsia-400 to-purple-600',
        stats: { avg: 78, grade: 'B+', attendance: 98, rank: 12, total: 120 },
        alerts: [
            { type: 'info', msg: 'Science Fair Project proposal due next week.' },
            { type: 'success', msg: 'Achieved 100% attendance this month!' },
        ],
        recentGrades: [
            { subject: 'Physics', score: 72, grade: 'B', teacher: 'Mr. David', teacherPhoto: 'https://randomuser.me/api/portraits/men/41.jpg' },
            { subject: 'History', score: 85, grade: 'A', teacher: 'Ms. Sarah', teacherPhoto: 'https://randomuser.me/api/portraits/women/68.jpg' },
            { subject: 'Literature', score: 78, grade: 'B+', teacher: 'Mr. Paul', teacherPhoto: 'https://randomuser.me/api/portraits/men/76.jpg' },
        ],
        performanceData: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [{ label: "Mary's Average (%)", data: [70, 72, 75, 74, 76, 78], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.4 }]
        }
    }
]

const accountAlerts = [
    { type: 'danger', msg: 'Consolidated School fees balance of UGX 565,000 due before March 1' },
]

const alertColors = {
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    danger: 'bg-red-50 border-red-300 text-red-800',
}

const alertIcons = {
    warning: <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />,
    success: <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />,
    info: <Bell size={15} className="text-blue-500 flex-shrink-0" />,
    danger: <AlertTriangle size={15} className="text-red-500 flex-shrink-0" />,
}

export default function ParentHome() {
    const [selectedChildId, setSelectedChildId] = useState(myChildren[0].id)
    const activeChild = myChildren.find(c => c.id === selectedChildId)

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">

                {/* Header & Child Selector */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Welcome back, Mrs. Namukasa</h1>
                        <p className="page-subtitle">You have {myChildren.length} children enrolled across the network.</p>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {myChildren.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChildId(child.id)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all min-w-[200px] text-left
                                    ${selectedChildId === child.id ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500' : 'bg-slate-50 border-slate-200 hover:bg-white'}
                                `}
                            >
                                {child.photo ? (
                                    <img src={child.photo} alt={child.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2 border-white shadow-sm" />
                                ) : (
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${child.theme} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                                        {child.initial}
                                    </div>
                                )}
                                <div>
                                    <p className={`font-bold text-sm leading-tight ${selectedChildId === child.id ? 'text-primary-700' : 'text-slate-700'}`}>{child.name}</p>
                                    <p className="text-[10px] font-semibold text-slate-500">{child.level} · {child.class}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Account Level Alerts */}
                {accountAlerts.length > 0 && (
                    <div className="space-y-2">
                        {accountAlerts.map((a, i) => (
                            <div key={`acc-alert-${i}`} className={`flex items-start gap-3 p-3 rounded-xl border ${alertColors[a.type]}`}>
                                {alertIcons[a.type]}
                                <p className="text-sm font-bold">{a.msg}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Active Child View */}
                <div key={activeChild.id} className="animate-fade-in space-y-6">

                    {/* Context Header */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg inline-flex">
                        <School size={16} className={activeChild.level === 'Primary' ? 'text-sky-500' : 'text-fuchsia-500'} />
                        Viewing records at <span className="text-slate-800">{activeChild.school}</span>
                    </div>

                    {/* Child Alerts */}
                    {activeChild.alerts.length > 0 && (
                        <div className="space-y-2">
                            {activeChild.alerts.map((a, i) => (
                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${alertColors[a.type]}`}>
                                    {alertIcons[a.type]}
                                    <p className="text-sm font-medium"><strong>{activeChild.name.split(' ')[0]}:</strong> {a.msg}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className={`stat-card border-l-4 ${activeChild.level === 'Primary' ? 'border-sky-500' : 'border-fuchsia-500'}`}>
                            <p className="text-2xl font-bold text-slate-900">{activeChild.stats.avg}%</p>
                            <p className="text-xs text-slate-500 mt-1">Overall Average</p>
                            <Badge variant="success">Grade {activeChild.stats.grade}</Badge>
                        </div>
                        <div className="stat-card border-l-4 border-emerald-500">
                            <p className="text-2xl font-bold text-emerald-600">{activeChild.stats.attendance}%</p>
                            <p className="text-xs text-slate-500 mt-1">Attendance Rate</p>
                        </div>
                        <div className="stat-card border-l-4 border-amber-500">
                            <p className="text-2xl font-bold text-slate-900">#{activeChild.stats.rank}</p>
                            <p className="text-xs text-slate-500 mt-1">Class Rank</p>
                            <p className="text-xs text-slate-400">of {activeChild.stats.total} students</p>
                        </div>
                        <div className="stat-card border-l-4 border-slate-300">
                            <p className="text-lg font-bold text-slate-700 truncate">{activeChild.studentId}</p>
                            <p className="text-xs text-slate-500 mt-1">System ID</p>
                        </div>
                    </div>

                    {/* Charts & Grades */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="card">
                            <h2 className="section-title">Performance Trend</h2>
                            <LineChart data={activeChild.performanceData} />
                        </div>
                        <div className="card">
                            <h2 className="section-title">Recent Subject Grades</h2>
                            <div className="space-y-3">
                                {activeChild.recentGrades.map(g => (
                                    <div key={g.subject} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors">
                                        <div className="flex gap-3 items-center">
                                            {g.teacherPhoto ? (
                                                <img src={g.teacherPhoto} alt={g.teacher} className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                    <BookOpen size={14} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{g.subject}</p>
                                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{g.teacher}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <p className="text-lg font-black text-slate-900">{g.score}%</p>
                                            <Badge variant={g.score >= 80 ? 'success' : 'warning'}>{g.grade}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    )
}
