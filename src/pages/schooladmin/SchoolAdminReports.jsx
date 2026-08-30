import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FileText, Download, TrendingUp, Users, DollarSign, CalendarDays, BarChart3, Printer } from 'lucide-react'

const termSummary = {
    totalStudents: 486,
    avgAttendance: '89.4%',
    feeCollection: 'UGX 142,500,000',
    feeOutstanding: 'UGX 23,800,000',
    passRate: '76.2%',
    topClass: 'P.6 Blue',
}

const reportTypes = [
    { id: 'attendance', label: 'Attendance Report', desc: 'Daily, weekly, and term attendance summary per class.', icon: CalendarDays, color: 'blue' },
    { id: 'academic', label: 'Academic Performance', desc: 'Subject-wise grades, rankings, and pass/fail rates.', icon: BarChart3, color: 'violet' },
    { id: 'financial', label: 'Fee Collection Report', desc: 'Payments received, outstanding balances, and payment history.', icon: DollarSign, color: 'emerald' },
    { id: 'enrollment', label: 'Enrollment Summary', desc: 'New enrollments, transfers, and class distribution.', icon: Users, color: 'amber' },
]

const recentReports = [
    { name: 'Term 3 2025 — Academic Performance', type: 'Academic', date: '2025-12-15', size: '1.2 MB' },
    { name: 'Term 3 2025 — Attendance Summary', type: 'Attendance', date: '2025-12-14', size: '840 KB' },
    { name: 'Term 3 2025 — Fee Collection', type: 'Financial', date: '2025-12-12', size: '560 KB' },
    { name: 'Term 2 2025 — Full Report Pack', type: 'All', date: '2025-08-20', size: '3.4 MB' },
]

export default function SchoolAdminReports({ role = 'schooladmin-primary' }) {
    const [generating, setGenerating] = useState(null)

    const handleGenerate = (id) => {
        setGenerating(id)
        setTimeout(() => setGenerating(null), 2000) // simulate
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><FileText size={22} className="text-blue-500" /> School Reports</h1>
                        <p className="page-subtitle">Generate and download termly reports for academics, attendance, and finances.</p>
                    </div>
                    <button className="btn-primary" onClick={() => handleGenerate('all')}><Printer size={15} /> Generate Full Report Pack</button>
                </div>

                {/* Term summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Total Students', value: termSummary.totalStudents, icon: Users, color: 'blue' },
                        { label: 'Avg Attendance', value: termSummary.avgAttendance, icon: CalendarDays, color: 'emerald' },
                        { label: 'Fee Collected', value: termSummary.feeCollection, icon: DollarSign, color: 'violet' },
                        { label: 'Outstanding', value: termSummary.feeOutstanding, icon: DollarSign, color: 'red' },
                        { label: 'Pass Rate', value: termSummary.passRate, icon: TrendingUp, color: 'amber' },
                        { label: 'Top Class', value: termSummary.topClass, icon: BarChart3, color: 'indigo' },
                    ].map((s) => (
                        <div key={s.label} className="card text-center">
                            <s.icon size={20} className={`mx-auto text-${s.color}-500 mb-2`} />
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{s.label}</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white mt-1 truncate">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Report type cards */}
                <div>
                    <h2 className="section-title">Generate Reports</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {reportTypes.map(r => (
                            <div key={r.id} className="card hover:shadow-lg transition-shadow">
                                <div className={`w-11 h-11 rounded-xl bg-${r.color}-100 dark:bg-${r.color}-900/20 flex items-center justify-center mb-4`}>
                                    <r.icon size={20} className={`text-${r.color}-600 dark:text-${r.color}-400`} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{r.label}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">{r.desc}</p>
                                <button
                                    className="btn-secondary w-full text-sm"
                                    onClick={() => handleGenerate(r.id)}
                                    disabled={generating === r.id}
                                >
                                    {generating === r.id ? (
                                        <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> Generating…</span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2"><Download size={14} /> Generate</span>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent downloads */}
                <div>
                    <h2 className="section-title">Recent Reports</h2>
                    <div className="card p-0">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Report Name', 'Type', 'Generated', 'Size', ''].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {recentReports.map((r, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                        <td className="table-cell font-medium text-sm text-gray-900 dark:text-white">{r.name}</td>
                                        <td className="table-cell text-xs text-gray-500 dark:text-slate-400">{r.type}</td>
                                        <td className="table-cell text-xs text-gray-400 dark:text-slate-500">{r.date}</td>
                                        <td className="table-cell text-xs text-gray-400 dark:text-slate-500">{r.size}</td>
                                        <td className="table-cell"><button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-semibold flex items-center gap-1"><Download size={12} /> Download</button></td>
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
