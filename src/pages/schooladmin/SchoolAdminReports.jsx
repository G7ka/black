import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FileText, TrendingUp, Users, DollarSign, CalendarDays, BarChart3, AlertCircle } from 'lucide-react'
import { schoolReportsApi } from '../../api/schoolOps.api'

const CURRENT_TERM = 'Term 1 2026'

const reportTypes = [
    { id: 'attendance', label: 'Attendance Report', desc: 'Daily, weekly, and term attendance summary per class.', icon: CalendarDays, color: 'blue' },
    { id: 'academic', label: 'Academic Performance', desc: 'Subject-wise grades, rankings, and pass/fail rates.', icon: BarChart3, color: 'violet' },
    { id: 'financial', label: 'Fee Collection Report', desc: 'Payments received, outstanding balances, and payment history.', icon: DollarSign, color: 'emerald' },
    { id: 'enrollment', label: 'Enrollment Summary', desc: 'New enrollments, transfers, and class distribution.', icon: Users, color: 'amber' },
]

export default function SchoolAdminReports({ role = 'schooladmin-primary' }) {
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            setReport(await schoolReportsApi.overview(CURRENT_TERM))
        } catch (err) {
            setLoadError(err.message || 'Failed to load report data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><FileText size={22} className="text-blue-500" /> School Reports</h1>
                        <p className="page-subtitle">Real-time academic, attendance, and fee-collection metrics for {CURRENT_TERM}.</p>
                    </div>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                {loading ? <p className="text-sm text-gray-400">Loading…</p> : report && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { label: 'Total Students', value: report.totalStudents, icon: Users, color: 'blue' },
                            { label: 'Total Teachers', value: report.totalTeachers, icon: Users, color: 'emerald' },
                            { label: 'Total Classes', value: report.totalClasses, icon: BarChart3, color: 'indigo' },
                            { label: 'Fee Collected', value: `UGX ${report.feeCollection.collected.toLocaleString()}`, icon: DollarSign, color: 'violet' },
                            { label: 'Fee Expected', value: `UGX ${report.feeCollection.expected.toLocaleString()}`, icon: DollarSign, color: 'red' },
                            { label: 'Collection Rate', value: `${report.feeCollection.collectionRate}%`, icon: TrendingUp, color: 'amber' },
                        ].map((s) => (
                            <div key={s.label} className="card text-center">
                                <s.icon size={20} className={`mx-auto text-${s.color}-500 mb-2`} />
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{s.label}</p>
                                <p className="text-base font-bold text-gray-900 dark:text-white mt-1 truncate">{s.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <h2 className="section-title">Report Categories</h2>
                    <p className="text-xs text-gray-400 mb-3 -mt-1">PDF/Excel report generation isn't wired up yet — no document pipeline exists behind these cards. The live metrics above reflect real data; downloadable report packs are a follow-up task.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {reportTypes.map(r => (
                            <div key={r.id} className="card opacity-60">
                                <div className={`w-11 h-11 rounded-xl bg-${r.color}-100 dark:bg-${r.color}-900/20 flex items-center justify-center mb-4`}>
                                    <r.icon size={20} className={`text-${r.color}-600 dark:text-${r.color}-400`} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{r.label}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">{r.desc}</p>
                                <button className="btn-secondary w-full text-sm" disabled title="Not wired up yet">Not available yet</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
