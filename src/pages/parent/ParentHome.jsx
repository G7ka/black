import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { LineChart } from '../../components/charts/Charts'
import { GraduationCap, CalendarDays, DollarSign, Award, TrendingUp, Bell, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react'

const performanceData = {
    labels: ['Start', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: "Ivan's Average (%)", data: [72, 75, 79, 77, 82, 84, 88], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 5 },
    ],
}

const recentGrades = [
    { subject: 'Mathematics', score: 88, grade: 'A', teacher: 'Mr. Okello' },
    { subject: 'English', score: 82, grade: 'B+', teacher: 'Ms. Nassali' },
    { subject: 'Science', score: 75, grade: 'B', teacher: 'Mr. Byaruhanga' },
]

const alerts = [
    { type: 'warning', msg: 'Ivan was late to school on Feb 17 (arrived 25 mins late)' },
    { type: 'success', msg: 'Ivan scored 88% in the Mathematics Fractions Test — Excellent!' },
    { type: 'info', msg: 'New assignment: Book Review due February 26' },
    { type: 'danger', msg: 'School fees balance of UGX 365,000 due before March 1' },
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
    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title">Hello, Mary! 👋</h1>
                        <p className="page-subtitle">Viewing: <strong>Ivan Namukasa</strong> · Class P6A · Kampala Primary School</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white font-bold">I</div>
                        <div><p className="font-semibold text-gray-900">Ivan Namukasa</p><p className="text-xs text-gray-500">P6A · Age 12 · STU-001</p></div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="space-y-2">
                    {alerts.map((a, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${alertColors[a.type]}`}>
                            {alertIcons[a.type]}
                            <p className="text-sm font-medium">{a.msg}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card border-l-4 border-blue-500"><p className="text-2xl font-bold text-primary-600">83%</p><p className="text-xs text-gray-500 mt-1">Overall Average</p><Badge variant="success">Grade A</Badge></div>
                    <div className="stat-card border-l-4 border-emerald-500"><p className="text-2xl font-bold text-emerald-600">94%</p><p className="text-xs text-gray-500 mt-1">Attendance Rate</p><p className="text-xs text-gray-400">47/50 days</p></div>
                    <div className="stat-card border-l-4 border-purple-500"><p className="text-2xl font-bold text-gray-900">#3</p><p className="text-xs text-gray-500 mt-1">Class Rank</p><p className="text-xs text-gray-400">of 38 students</p></div>
                    <div className="stat-card border-l-4 border-red-400"><p className="text-2xl font-bold text-red-600">UGX 365K</p><p className="text-xs text-gray-500 mt-1">Balance Due</p><Badge variant="danger">Partial</Badge></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card"><h2 className="section-title">Ivan's Performance Trend</h2><LineChart data={performanceData} /></div>
                    <div className="card">
                        <h2 className="section-title">Recent Grades</h2>
                        <div className="space-y-3">
                            {recentGrades.map(g => (
                                <div key={g.subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div><p className="text-sm font-semibold text-gray-900">{g.subject}</p><p className="text-xs text-gray-400">{g.teacher}</p></div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">{g.score}%</p>
                                        <Badge variant={g.score >= 80 ? 'success' : 'warning'}>{g.grade}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <a href="/parent/messages" onClick={e => e.preventDefault()} className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"><MessageSquare size={13} /> Message Teacher</a>
                            <a href="/parent/fees" onClick={e => e.preventDefault()} className="btn-primary text-xs py-2 flex items-center justify-center gap-1"><DollarSign size={13} /> Pay Fees</a>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
