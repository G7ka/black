import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { LineChart, BarChart } from '../../components/charts/Charts'
import { DollarSign, TrendingUp, Building2, ArrowUpRight } from 'lucide-react'

const revenueWaterfall = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'Actual Revenue (UGX M)', data: [42, 58, 63, 71, 85, 98, 112], backgroundColor: '#2563eb', borderRadius: 6 },
        { label: 'Forecast', data: [null, null, null, null, null, null, null, 120, 135, 148], backgroundColor: 'rgba(37,99,235,0.3)', borderRadius: 6 },
    ],
}

const forecastData = {
    labels: ['Feb', 'Mar', 'Apr', 'May'],
    datasets: [
        { label: 'Revenue Forecast (UGX M)', data: [112, 128, 142, 159], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 5, borderDash: [] },
        { label: '3-Month Projection', data: [112, 125, 138, 155], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.06)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointRadius: 5, borderDash: [6, 3] },
    ],
}

const upsells = [
    { school: 'Greenhill Academy', current: 'Pro', next: 'Enterprise', students: 1240, limit: 2000, pct: 62 },
    { school: 'Buganda Road PS', current: 'Basic', next: 'Pro', students: 430, limit: 500, pct: 86 },
    { school: 'Gulu Excellence', current: 'Basic', next: 'Pro', students: 320, limit: 500, pct: 64 },
    { school: 'Mbarara High', current: 'Basic', next: 'Pro', students: 410, limit: 500, pct: 82 },
]

export default function SABI() {
    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title">Business Intelligence</h1><p className="page-subtitle">Revenue analysis, forecasts, and growth opportunities</p></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="MRR" value="UGX 112M" icon={DollarSign} color="blue" trend="up" trendValue="+14.3% MoM" />
                    <StatCard title="ARR Projection" value="UGX 1.34B" icon={TrendingUp} color="green" trend="up" trendValue="Based on current MRR" />
                    <StatCard title="LTV per School" value="UGX 2.8M" icon={Building2} color="purple" />
                    <StatCard title="CAC" value="UGX 180K" icon={ArrowUpRight} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card"><h2 className="section-title">Monthly Revenue</h2><BarChart data={revenueWaterfall} /></div>
                    <div className="card"><h2 className="section-title">3-Month Revenue Forecast</h2><LineChart data={forecastData} /></div>
                </div>

                <div className="card">
                    <h2 className="section-title">Upsell Opportunities</h2>
                    <p className="text-sm text-gray-500 mb-4">Schools approaching their plan limits — ideal candidates to upgrade</p>
                    <div className="space-y-4">
                        {upsells.map(u => (
                            <div key={u.school} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{u.school}</p>
                                    <p className="text-xs text-gray-500">{u.students}/{u.limit} students · Currently on <span className="font-medium">{u.current}</span></p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div className={`h-1.5 rounded-full ${u.pct >= 80 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${u.pct}%` }} />
                                        </div>
                                        <span className={`text-xs font-semibold ${u.pct >= 80 ? 'text-amber-600' : 'text-blue-600'}`}>{u.pct}%</span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-500 mb-2">Recommend: <span className="font-semibold text-primary-600">{u.next}</span></p>
                                    <button className="btn-primary text-xs py-1.5 px-3"><ArrowUpRight size={12} /> Send Offer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
