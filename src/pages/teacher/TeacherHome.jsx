import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { LineChart } from '../../components/charts/Charts'
import { GraduationCap, CalendarDays, ClipboardList, TrendingUp, Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const performanceData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'P6A Average (%)', data: [64, 68, 71, 73, 76, 79, 82], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 4 },
        { label: 'P7B Average (%)', data: [58, 62, 65, 70, 72, 68, 74], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointRadius: 4 },
    ],
}

const upcoming = [
    { task: 'Mark P6A Term Test papers', due: 'Today', type: 'grading', urgent: true },
    { task: 'P7B Mathematics Assignment', due: 'Tomorrow', type: 'assignment', urgent: false },
    { task: 'Submit P6 Progress Reports', due: 'Feb 25', type: 'report', urgent: false },
    { task: 'Parent-Teacher Meeting', due: 'Feb 28', type: 'meeting', urgent: false },
]

const recentActivity = [
    { icon: CheckCircle, color: 'text-emerald-500', text: 'Marked attendance for P6A — 38/40 present', time: '9:15 AM' },
    { icon: Bell, color: 'text-blue-500', text: 'New assignment submission: Ivan N. — Mathematics', time: '8:45 AM' },
    { icon: AlertCircle, color: 'text-amber-500', text: 'Grace M. flagged for 3 consecutive absences', time: 'Yesterday' },
    { icon: CheckCircle, color: 'text-emerald-500', text: 'P7B grades submitted for Term 1 Science', time: 'Yesterday' },
]

export default function TeacherHome() {
    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div>
                    <h1 className="page-title">Welcome, Mr. Okello 👋</h1>
                    <p className="page-subtitle">Mathematics Teacher — Kampala Primary School, Term 1 2026</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="My Classes" value="2" subtitle="P6A & P7B" icon={GraduationCap} color="blue" />
                    <StatCard title="Total Students" value="78" subtitle="Across both classes" icon={GraduationCap} color="green" trend="up" trendValue="38 P6A · 40 P7B" />
                    <StatCard title="Attendance Today" value="93.5%" subtitle="73 of 78 present" icon={CalendarDays} color="purple" trend="up" trendValue="+1.5% vs yesterday" />
                    <StatCard title="Assignments Due" value="3" subtitle="2 ungraded" icon={ClipboardList} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card lg:col-span-2">
                        <h2 className="section-title">Student Performance Trends</h2>
                        <LineChart data={performanceData} />
                    </div>
                    <div className="card">
                        <h2 className="section-title">Upcoming Tasks</h2>
                        <div className="space-y-3">
                            {upcoming.map((u, i) => (
                                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${u.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                                    <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${u.urgent ? 'bg-red-500' : 'bg-blue-400'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800">{u.task}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Clock size={11} className="text-gray-400" />
                                            <span className={`text-xs font-medium ${u.urgent ? 'text-red-600' : 'text-gray-400'}`}>{u.due}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="section-title">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <a.icon size={15} className={`mt-0.5 flex-shrink-0 ${a.color}`} />
                                    <div><p className="text-sm text-gray-700">{a.text}</p><p className="text-xs text-gray-400">{a.time}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h2 className="section-title">Class Performance Summary</h2>
                        {[
                            { class: 'P6A', top: 'Grace Mukasa (94%)', low: 'Moses Achola (58%)', avg: '82%', color: 'bg-blue-500' },
                            { class: 'P7B', top: 'Faith Ssali (91%)', low: 'Samuel K. (52%)', avg: '74%', color: 'bg-emerald-500' },
                        ].map(c => (
                            <div key={c.class} className="mb-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-gray-900">{c.class}</p>
                                    <Badge variant="info">Avg: {c.avg}</Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                    <div className={`${c.color} h-1.5 rounded-full`} style={{ width: c.avg }} />
                                </div>
                                <p className="text-xs text-gray-500">🏆 Top: {c.top}</p>
                                <p className="text-xs text-gray-400">⚠ Needs support: {c.low}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
