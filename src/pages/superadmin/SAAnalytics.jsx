import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { LineChart, BarChart, DoughnutChart } from '../../components/charts/Charts'
import { Building2, GraduationCap, DollarSign, TrendingDown, Download, FileText, TrendingUp, ArrowUpRight } from 'lucide-react'

const growthData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'Schools', data: [180, 195, 205, 215, 228, 239, 247], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 4 },
        { label: 'Students (÷100)', data: [410, 455, 490, 525, 570, 620, 684], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointRadius: 4 },
    ],
}
const retentionData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [{ label: 'Retention Rate (%)', data: [94, 95, 93, 96, 97, 95, 96], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#8b5cf6', pointRadius: 4 }],
}
const districtData = {
    labels: ['Kampala', 'Wakiso', 'Mukono', 'Gulu', 'Mbarara', 'Jinja', 'Others'],
    datasets: [{ data: [84, 52, 31, 25, 22, 15, 18], backgroundColor: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0e7ff'], borderWidth: 0 }],
}
const revenueBar = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'Actual Revenue (UGX M)', data: [42, 58, 63, 71, 85, 98, 112], backgroundColor: '#2563eb', borderRadius: 6 },
        { label: 'Forecast', data: [null, null, null, null, null, null, null, 120, 135, 148], backgroundColor: 'rgba(37,99,235,0.3)', borderRadius: 6 },
    ],
}
const forecastData = {
    labels: ['Feb', 'Mar', 'Apr', 'May'],
    datasets: [
        { label: 'Revenue Forecast (UGX M)', data: [112, 128, 142, 159], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 5 },
        { label: '3-Month Projection', data: [112, 125, 138, 155], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointRadius: 5, borderDash: [6, 3] },
    ],
}

const upsells = [
    { school: 'Greenhill Academy', current: 'Pro', next: 'Enterprise', students: 1240, limit: 2000, pct: 62 },
    { school: 'Buganda Road PS', current: 'Basic', next: 'Pro', students: 430, limit: 500, pct: 86 },
    { school: 'Gulu Excellence', current: 'Basic', next: 'Pro', students: 320, limit: 500, pct: 64 },
    { school: 'Mbarara High', current: 'Basic', next: 'Pro', students: 410, limit: 500, pct: 82 },
]

export default function SAAnalytics() {
    const [format, setFormat] = useState('PDF')
    const [dateRange, setDateRange] = useState({ from: '2026-01-01', to: '2026-02-22' })

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div><h1 className="page-title">Analytics & Reports</h1><p className="page-subtitle">Platform-wide metrics, forecasts, and insights</p></div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm">
                        <span className="text-gray-500 dark:text-slate-400 text-xs font-medium">Period:</span>
                        <input type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} className="text-xs border-0 outline-none bg-transparent dark:text-slate-200" />
                        <span className="text-gray-400 dark:text-slate-500">—</span>
                        <input type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} className="text-xs border-0 outline-none bg-transparent dark:text-slate-200" />
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Schools" value="247" icon={Building2} color="blue" trend="up" trendValue="+12 this month" />
                    <StatCard title="Total Students" value="68,430" icon={GraduationCap} color="green" trend="up" trendValue="+8.3%" />
                    <StatCard title="Monthly Revenue" value="UGX 112M" icon={DollarSign} color="purple" trend="up" trendValue="+14.3%" />
                    <StatCard title="Churn Rate" value="3.2%" icon={TrendingDown} color="red" trend="down" trendValue="-0.5% improved" />
                </div>

                {/* Business Intelligence Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="MRR" value="UGX 112M" icon={DollarSign} color="blue" trend="up" trendValue="+14.3% MoM" />
                    <StatCard title="ARR Projection" value="UGX 1.34B" icon={TrendingUp} color="green" trend="up" trendValue="Based on current MRR" />
                    <StatCard title="LTV per School" value="UGX 2.8M" icon={Building2} color="purple" />
                    <StatCard title="CAC" value="UGX 180K" icon={ArrowUpRight} color="amber" />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card"><h2 className="section-title">Platform Growth</h2><LineChart data={growthData} /></div>
                    <div className="card"><h2 className="section-title">Monthly Revenue</h2><BarChart data={revenueBar} /></div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card"><h2 className="section-title">3-Month Revenue Forecast</h2><LineChart data={forecastData} /></div>
                    <div className="card"><h2 className="section-title">Retention Rate</h2><LineChart data={retentionData} /></div>
                </div>

                {/* District Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card"><h2 className="section-title">Schools by District</h2><DoughnutChart data={districtData} /></div>

                    {/* Upsell Opportunities */}
                    <div className="card">
                        <h2 className="section-title">Upsell Opportunities</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Schools approaching their plan limits — ideal candidates to upgrade</p>
                        <div className="space-y-4">
                            {upsells.map(u => (
                                <div key={u.school} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{u.school}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{u.students}/{u.limit} students · Currently on <span className="font-medium">{u.current}</span></p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full ${u.pct >= 80 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${u.pct}%` }} />
                                            </div>
                                            <span className={`text-xs font-semibold ${u.pct >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>{u.pct}%</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Recommend: <span className="font-semibold text-primary-600 dark:text-blue-400">{u.next}</span></p>
                                        <button className="btn-primary text-xs py-1.5 px-3"><ArrowUpRight size={12} /> Send Offer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Report Generator */}
                <div className="card">
                    <h2 className="section-title">Custom Report Generator</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Report Type</label>
                            <select className="select-field">
                                <option>Revenue Summary</option>
                                <option>School Enrollment</option>
                                <option>Subscription Status</option>
                                <option>Support Tickets</option>
                                <option>Geographic Distribution</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">From Date</label>
                            <input type="date" className="input-field" defaultValue="2026-01-01" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">To Date</label>
                            <input type="date" className="input-field" defaultValue="2026-02-22" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Format</label>
                            <div className="flex gap-2">
                                {['PDF', 'Excel'].map(f => (
                                    <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${format === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'}`}>{f}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button className="btn-primary"><FileText size={15} /> Generate Report</button>
                        <button className="btn-secondary"><Download size={15} /> Download Last</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
