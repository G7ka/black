import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { CalendarDays, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Generate Feb calendar data for student
const generateCalendar = () => {
    const days = []
    // Feb has 28 days in 2026 — start on Sunday (day 0)
    const startDay = 0 // Feb 1, 2026 is a Sunday
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let i = 1; i <= 28; i++) {
        const dayOfWeek = (startDay + i - 1) % 7
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const isFuture = i > 22
        if (isWeekend) days.push({ day: i, status: 'weekend' })
        else if (isFuture) days.push({ day: i, status: 'future' })
        else {
            // realistic attendance
            const statuses = ['present', 'present', 'present', 'present', 'absent', 'present', 'present', 'present', 'late', 'present']
            days.push({ day: i, status: statuses[Math.abs(i * 7) % statuses.length] })
        }
    }
    return days
}

const calendar = generateCalendar()

const history = [
    { date: 'Mon, Feb 20', status: 'present', subject: null },
    { date: 'Tue, Feb 18', status: 'present', subject: null },
    { date: 'Mon, Feb 17', status: 'late', reason: 'Arrived 25 minutes late' },
    { date: 'Fri, Feb 13', status: 'absent', reason: 'Sick — note submitted' },
    { date: 'Thu, Feb 12', status: 'present', subject: null },
    { date: 'Wed, Feb 11', status: 'present', subject: null },
    { date: 'Tue, Feb 10', status: 'absent', reason: 'Family event' },
]

const statusIcon = { present: <CheckCircle size={14} className="text-emerald-500" />, absent: <XCircle size={14} className="text-red-500" />, late: <Clock size={14} className="text-amber-500" /> }
const statusVariant = { present: 'success', absent: 'danger', late: 'warning' }
const calColor = { present: 'bg-emerald-500', absent: 'bg-red-500', late: 'bg-amber-500', weekend: 'bg-gray-100', future: 'bg-gray-50' }

export default function StudentAttendance() {
    const present = calendar.filter(d => d?.status === 'present').length
    const absent = calendar.filter(d => d?.status === 'absent').length
    const late = calendar.filter(d => d?.status === 'late').length
    const total = present + absent + late
    const rate = Math.round((present / total) * 100)

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div><h1 className="page-title">My Attendance</h1><p className="page-subtitle">Track your attendance record for Term 1, 2026</p></div>

                {rate < 90 && (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 font-medium">Your attendance is below 90%. Please maintain regular attendance to avoid academic penalties.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat-card text-center border-l-4 border-primary-500"><p className="text-3xl font-bold text-primary-600">{rate}%</p><p className="text-xs text-gray-500 mt-1">Attendance Rate</p></div>
                    <div className="stat-card text-center border-l-4 border-emerald-500"><p className="text-3xl font-bold text-emerald-600">{present}</p><p className="text-xs text-gray-500 mt-1">Days Present</p></div>
                    <div className="stat-card text-center border-l-4 border-red-500"><p className="text-3xl font-bold text-red-500">{absent}</p><p className="text-xs text-gray-500 mt-1">Days Absent</p></div>
                    <div className="stat-card text-center border-l-4 border-amber-500"><p className="text-3xl font-bold text-amber-500">{late}</p><p className="text-xs text-gray-500 mt-1">Days Late</p></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div className="card">
                        <h2 className="section-title">February 2026</h2>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendar.map((d, i) => (
                                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${d === null ? '' : d.status === 'weekend' ? 'text-gray-300' : d.status === 'future' ? 'text-gray-300 border border-dashed border-gray-200' : `${calColor[d.status]} text-white`}`}>
                                    {d?.day}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4 text-xs">
                            {[['bg-emerald-500', 'Present'], ['bg-red-500', 'Absent'], ['bg-amber-500', 'Late'], ['bg-gray-100', 'Weekend']].map(([color, label]) => (
                                <div key={label} className="flex items-center gap-1"><div className={`w-3 h-3 rounded ${color}`} />{label}</div>
                            ))}
                        </div>
                    </div>

                    {/* History */}
                    <div className="card">
                        <h2 className="section-title">Attendance History</h2>
                        <div className="space-y-2">
                            {history.map((h, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50/30">
                                    <div className="flex items-center gap-3">
                                        {statusIcon[h.status]}
                                        <div><p className="text-sm font-medium text-gray-800">{h.date}</p>{h.reason && <p className="text-xs text-gray-400">{h.reason}</p>}</div>
                                    </div>
                                    <Badge variant={statusVariant[h.status]}>{h.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
