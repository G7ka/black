import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { LineChart } from '../../components/charts/Charts'
import { BookOpen, CalendarDays, ClipboardList, TrendingUp, TrendingDown, Clock, Bell, Award } from 'lucide-react'

const performanceData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'My Average (%)', data: [72, 75, 79, 77, 82, 84, 88], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 5 },
        { label: 'Class Average (%)', data: [68, 70, 73, 72, 75, 76, 80], borderColor: '#94a3b8', backgroundColor: 'rgba(148,163,184,0.05)', fill: true, tension: 0.4, pointBackgroundColor: '#94a3b8', pointRadius: 4 },
    ],
}

const subjects = [
    { name: 'Mathematics', score: 88, grade: 'A', trend: 'up' },
    { name: 'English', score: 82, grade: 'B+', trend: 'up' },
    { name: 'Science', score: 75, grade: 'B', trend: 'down' },
    { name: 'Social Studies', score: 91, grade: 'A', trend: 'up' },
    { name: 'Religious Ed.', score: 79, grade: 'B+', trend: 'up' },
]

const schedule = [
    { time: '8:00', subject: 'Morning Assembly', room: 'Hall', teacher: '' },
    { time: '8:30', subject: 'Mathematics', room: 'Room 6A', teacher: 'Mr. Okello' },
    { time: '9:30', subject: 'English', room: 'Room 6A', teacher: 'Ms. Nassali' },
    { time: '10:30', subject: 'Break', room: '—', teacher: '' },
    { time: '11:00', subject: 'Science', room: 'Lab 1', teacher: 'Mr. Byaruhanga' },
    { time: '12:00', subject: 'Lunch', room: '—', teacher: '' },
    { time: '13:00', subject: 'Social Studies', room: 'Room 6A', teacher: 'Ms. Acen' },
    { time: '14:00', subject: 'Religious Ed.', room: 'Room 6A', teacher: 'Mr. Waiswa' },
]

const dueAssignments = [
    { title: 'Fractions & Decimals Worksheet', subject: 'Mathematics', due: 'Tomorrow', urgent: true },
    { title: 'Book Review — Animal Farm', subject: 'English', due: 'Feb 26', urgent: false },
    { title: 'Science Diagram — Cell Structure', subject: 'Science', due: 'Feb 28', urgent: false },
]

export default function StudentHome() {
    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title">Hello, Ivan! 👋</h1>
                        <p className="page-subtitle">Class P6A · Kampala Primary School · Term 1, 2026</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <Award size={18} className="text-emerald-600" />
                        <p className="text-sm font-semibold text-emerald-700">Rank: 3rd in Class</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card border-l-4 border-blue-500"><p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Overall Average</p><p className="text-2xl font-bold text-gray-900 mt-1">83%</p><Badge variant="success">Grade: A</Badge></div>
                    <div className="stat-card border-l-4 border-emerald-500"><p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Attendance</p><p className="text-2xl font-bold text-gray-900 mt-1">94%</p><p className="text-xs text-gray-400 mt-1">47 of 50 days</p></div>
                    <div className="stat-card border-l-4 border-amber-500"><p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Assignments Due</p><p className="text-2xl font-bold text-gray-900 mt-1">3</p><p className="text-xs text-red-500 mt-1">1 due tomorrow</p></div>
                    <div className="stat-card border-l-4 border-purple-500"><p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Class Rank</p><p className="text-2xl font-bold text-gray-900 mt-1">#3</p><p className="text-xs text-gray-400 mt-1">of 38 students</p></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card lg:col-span-2">
                        <h2 className="section-title">My Performance Trend</h2>
                        <LineChart data={performanceData} />
                    </div>
                    <div className="card">
                        <h2 className="section-title">Current Grades</h2>
                        <div className="space-y-3">
                            {subjects.map(s => (
                                <div key={s.name} className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-medium text-gray-700 truncate">{s.name}</p>
                                            <div className="flex items-center gap-1">
                                                <span className={`text-xs font-bold ${s.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{s.score}%</span>
                                                {s.trend === 'up' ? <TrendingUp size={11} className="text-emerald-500" /> : <TrendingDown size={11} className="text-red-500" />}
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${s.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${s.score}%` }} /></div>
                                    </div>
                                    <Badge variant={s.score >= 80 ? 'success' : 'warning'} >{s.grade}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="section-title">Today's Schedule</h2>
                        <div className="space-y-2">
                            {schedule.map((s, i) => (
                                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${s.subject === 'Break' || s.subject === 'Lunch' ? 'bg-gray-50' : 'bg-blue-50/50'}`}>
                                    <span className="text-xs font-mono text-gray-400 w-12 flex-shrink-0">{s.time}</span>
                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${s.subject === 'Break' || s.subject === 'Lunch' ? 'text-gray-400' : 'text-gray-800'}`}>{s.subject}</p>
                                        {s.teacher && <p className="text-xs text-gray-400">{s.teacher} · {s.room}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="section-title">Assignments Due</h2>
                        <div className="space-y-3">
                            {dueAssignments.map((a, i) => (
                                <div key={i} className={`p-4 rounded-xl border-2 ${a.urgent ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                                    <div className="flex items-start justify-between">
                                        <div><p className="text-sm font-semibold text-gray-900">{a.title}</p><Badge variant="info">{a.subject}</Badge></div>
                                        <div className={`flex items-center gap-1 text-xs font-semibold ${a.urgent ? 'text-red-600' : 'text-gray-400'}`}><Clock size={11} />{a.due}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
