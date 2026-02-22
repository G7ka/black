import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

const history = [
    { date: 'Mon, Feb 22', status: 'present' },
    { date: 'Fri, Feb 20', status: 'present' },
    { date: 'Thu, Feb 19', status: 'present' },
    { date: 'Wed, Feb 18', status: 'present' },
    { date: 'Tue, Feb 17', status: 'late', reason: 'Arrived 25 minutes late. Please ensure punctuality.' },
    { date: 'Mon, Feb 16', status: 'present' },
    { date: 'Fri, Feb 13', status: 'absent', reason: 'Sick — medical note received. Missed Mathematics and English classes.' },
    { date: 'Thu, Feb 12', status: 'present' },
    { date: 'Wed, Feb 11', status: 'present' },
    { date: 'Tue, Feb 10', status: 'absent', reason: 'Family event (excused).' },
]

const icons = { present: <CheckCircle size={16} className="text-emerald-500" />, absent: <XCircle size={16} className="text-red-500" />, late: <Clock size={16} className="text-amber-500" /> }
const variants = { present: 'success', absent: 'danger', late: 'warning' }

export default function ParentAttendance() {
    const present = history.filter(h => h.status === 'present').length
    const absent = history.filter(h => h.status === 'absent').length
    const late = history.filter(h => h.status === 'late').length
    const rate = Math.round((present / history.length) * 100)

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div><h1 className="page-title">Ivan's Attendance</h1><p className="page-subtitle">Attendance record for Term 1, 2026</p></div>

                {rate < 90 && (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">Attendance Below 90% Threshold</p>
                            <p className="text-xs text-amber-700 mt-0.5">Ivan's attendance rate is {rate}%. If it falls below 85%, he may be at risk of academic review. Please ensure regular school attendance.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat-card border-l-4 border-blue-500 text-center"><p className="text-3xl font-bold text-primary-600">{rate}%</p><p className="text-xs text-gray-500 mt-1">Attendance Rate</p></div>
                    <div className="stat-card border-l-4 border-emerald-500 text-center"><p className="text-3xl font-bold text-emerald-600">{present}</p><p className="text-xs text-gray-500 mt-1">Days Present</p></div>
                    <div className="stat-card border-l-4 border-red-500 text-center"><p className="text-3xl font-bold text-red-500">{absent}</p><p className="text-xs text-gray-500 mt-1">Days Absent</p></div>
                    <div className="stat-card border-l-4 border-amber-500 text-center"><p className="text-3xl font-bold text-amber-500">{late}</p><p className="text-xs text-gray-500 mt-1">Days Late</p></div>
                </div>

                <div className="card">
                    <h2 className="section-title">Day-by-Day Record</h2>
                    <div className="space-y-2">
                        {history.map((h, i) => (
                            <div key={i} className={`flex items-start justify-between p-4 rounded-xl border ${h.status === 'absent' ? 'bg-red-50 border-red-200' : h.status === 'late' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                                <div className="flex items-start gap-3">
                                    {icons[h.status]}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{h.date}</p>
                                        {h.reason && <p className="text-xs text-gray-600 mt-0.5">{h.reason}</p>}
                                    </div>
                                </div>
                                <Badge variant={variants[h.status]}>{h.status}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
