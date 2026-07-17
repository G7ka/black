import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { CalendarDays, CheckCircle2, XCircle, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { attendanceApi } from '../../api/schoolOps.api'

export default function SchoolAdminAttendance({ role = 'schooladmin-primary' }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
    const [overview, setOverview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            setOverview(await attendanceApi.overview(selectedDate))
        } catch (err) {
            setLoadError(err.message || 'Failed to load attendance')
        } finally {
            setLoading(false)
        }
    }, [selectedDate])

    useEffect(() => { load() }, [load])

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

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                {!loading && overview?.summary.totalStudents === 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                        No attendance has been recorded for this date yet — per-student marking happens from the Teacher portal, which isn't built yet. This page shows real data, currently empty rather than a mock.
                    </div>
                )}

                {loading ? <p className="text-sm text-gray-400">Loading…</p> : overview && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Students', value: overview.summary.totalStudents, icon: Users, color: 'blue' },
                                { label: 'Present', value: overview.summary.present, icon: CheckCircle2, color: 'emerald' },
                                { label: 'Absent', value: overview.summary.absent, icon: XCircle, color: 'red' },
                                { label: 'Overall Rate', value: overview.summary.overallRate, icon: TrendingUp, color: 'violet' },
                            ].map(s => (
                                <div key={s.label} className="card text-center">
                                    <s.icon size={22} className={`mx-auto text-${s.color}-500 mb-2`} />
                                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="section-title flex items-center gap-2"><Clock size={16} /> Class-by-Class Breakdown — {selectedDate}</h2>
                            <div className="card p-0">
                                <div className="overflow-x-auto"><table className="w-full">
                                    <thead><tr>{['Class', 'Total', 'Present', 'Absent', 'Rate'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                                    <tbody>
                                        {overview.classes.map(c => (
                                            <tr key={c.classId} className="hover:bg-blue-50/30">
                                                <td className="table-cell font-semibold text-gray-900">{c.name}</td>
                                                <td className="table-cell text-sm">{c.total}</td>
                                                <td className="table-cell text-sm text-emerald-600 font-medium">{c.present}</td>
                                                <td className="table-cell text-sm text-red-500 font-medium">{c.absent}</td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[100px]"><div className="h-2 bg-emerald-500 rounded-full" style={{ width: c.rate }} /></div>
                                                        <span className="text-xs font-semibold text-gray-700">{c.rate}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {overview.classes.length === 0 && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">No classes yet.</td></tr>}
                                    </tbody>
                                </table></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
