import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { LineChart, DoughnutChart } from '../../components/charts/Charts'
import { Building2, GraduationCap, DollarSign, TrendingDown, AlertCircle } from 'lucide-react'
import { analyticsApi } from '../../api/platformOps.api'

const DISTRICT_COLORS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0e7ff']

export default function SAAnalytics() {
    const [overview, setOverview] = useState(null)
    const [growth, setGrowth] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const [overviewResult, growthResult] = await Promise.all([
                analyticsApi.overview(),
                analyticsApi.growth(),
            ])
            setOverview(overviewResult)
            setGrowth(growthResult)
        } catch (err) {
            setError(err.message || 'Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const growthData = {
        labels: growth.map(g => g.period),
        datasets: [{ label: 'New Schools Registered', data: growth.map(g => g.newSchools), borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 4 }],
    }

    const districtData = overview ? {
        labels: overview.schoolsByDistrict.map(d => d.district),
        datasets: [{ data: overview.schoolsByDistrict.map(d => d.count), backgroundColor: DISTRICT_COLORS, borderWidth: 0 }],
    } : null

    if (loading) {
        return <DashboardLayout role="superadmin"><p className="text-sm text-gray-400">Loading analytics…</p></DashboardLayout>
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title">Analytics & Reports</h1><p className="page-subtitle">Platform-wide metrics based on real registered data</p></div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {overview && (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Schools" value={String(overview.totalSchools)} icon={Building2} color="blue" />
                            <StatCard title="Declared Students" value={overview.declaredStudents.toLocaleString()} icon={GraduationCap} color="green" />
                            <StatCard title="Monthly Revenue" value={`UGX ${overview.monthlyRevenue.toLocaleString()}`} icon={DollarSign} color="purple" />
                            <StatCard title="Overdue Invoices" value={String(overview.overdueInvoices)} icon={TrendingDown} color="red" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card">
                                <h2 className="section-title">School Registration Growth</h2>
                                <p className="text-xs text-gray-400 mb-2">Real registration dates — accumulates as more schools sign up.</p>
                                {growth.length > 0 ? <LineChart data={growthData} /> : <p className="text-sm text-gray-400">Not enough history yet.</p>}
                            </div>
                            <div className="card">
                                <h2 className="section-title">Active Schools by District</h2>
                                {districtData && districtData.labels.length > 0 ? <DoughnutChart data={districtData} /> : <p className="text-sm text-gray-400">No active schools yet.</p>}
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="section-title">Not Yet Available</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                Metrics like teacher/student headcounts, churn rate, retention, and revenue forecasts depend on academic
                                data (Phase 4+) and multiple months of billing history. They'll appear here once that data exists —
                                this page intentionally doesn't show placeholder numbers for them.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
