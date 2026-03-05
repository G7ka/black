import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { CalendarDays, CheckCircle2, XCircle, Users, TrendingUp, Clock } from 'lucide-react'

const classData = [
    { name: 'P.1 Red', total: 45, present: 42, absent: 3, rate: '93.3%' },
    { name: 'P.2 Blue', total: 48, present: 44, absent: 4, rate: '91.7%' },
    { name: 'P.3 Green', total: 40, present: 36, absent: 4, rate: '90.0%' },
    { name: 'P.4 Yellow', total: 52, present: 45, absent: 7, rate: '86.5%' },
    { name: 'P.5 Orange', total: 44, present: 40, absent: 4, rate: '90.9%' },
    { name: 'P.6 Blue', total: 50, present: 47, absent: 3, rate: '94.0%' },
    { name: 'P.7 Red', total: 38, present: 33, absent: 5, rate: '86.8%' },
]

export default function SchoolAdminAttendance({ role = 'schooladmin-primary' }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

    const totalStudents = classData.reduce((s, c) => s + c.total, 0)
    const totalPresent = classData.reduce((s, c) => s + c.present, 0)
    const totalAbsent = classData.reduce((s, c) => s + c.absent, 0)
    const overallRate = ((totalPresent / totalStudents) * 100).toFixed(1)

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><CalendarDays size={22} className="text-blue-500" /> Attendance Overview</h1>
                        <p className="page-subtitle">Monitor daily attendance across all classes.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">Date:</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field !py-2 !px-3 max-w-[180px]" />
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Students', value: totalStudents, icon: Users, color: 'blue' },
                        { label: 'Present Today', value: totalPresent, icon: CheckCircle2, color: 'emerald' },
                        { label: 'Absent Today', value: totalAbsent, icon: XCircle, color: 'red' },
                        { label: 'Overall Rate', value: `${overallRate}%`, icon: TrendingUp, color: 'violet' },
                    ].map(s => (
                        <div key={s.label} className="card text-center">
                            <s.icon size={22} className={`mx-auto text-${s.color}-500 mb-2`} />
                            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Class breakdown table */}
                <div>
                    <h2 className="section-title flex items-center gap-2"><Clock size={16} /> Class-by-Class Breakdown — {selectedDate}</h2>
                    <div className="card p-0">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Class', 'Total', 'Present', 'Absent', 'Rate'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {classData.map(c => (
                                    <tr key={c.name} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-semibold text-gray-900">{c.name}</td>
                                        <td className="table-cell text-sm">{c.total}</td>
                                        <td className="table-cell text-sm text-emerald-600 font-medium">{c.present}</td>
                                        <td className="table-cell text-sm text-red-500 font-medium">{c.absent}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[100px]">
                                                    <div className="h-2 bg-emerald-500 rounded-full" style={{ width: c.rate }} />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700">{c.rate}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
