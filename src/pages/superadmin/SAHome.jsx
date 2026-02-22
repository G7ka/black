import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { LineChart, BarChart, DoughnutChart } from '../../components/charts/Charts'
import {
    Building2, Users, DollarSign, TrendingUp,
    GraduationCap, AlertCircle, CheckCircle, Clock
} from 'lucide-react'

const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']

const revenueData = {
    labels: months,
    datasets: [
        {
            label: 'Revenue (UGX M)',
            data: [42, 58, 63, 71, 85, 98, 112],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2563eb',
            pointRadius: 4,
        },
        {
            label: 'Subscriptions',
            data: [28, 38, 44, 51, 60, 70, 80],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.06)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
        },
    ],
}

const schoolGrowthData = {
    labels: months,
    datasets: [
        {
            label: 'New Schools',
            data: [8, 14, 11, 19, 23, 17, 28],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
        },
    ],
}

const districtData = {
    labels: ['Kampala', 'Wakiso', 'Mukono', 'Gulu', 'Mbarara', 'Others'],
    datasets: [{
        data: [34, 22, 18, 12, 9, 5],
        backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
        borderWidth: 0,
    }],
}

const recentActivity = [
    { icon: CheckCircle, color: 'text-emerald-500', text: 'Greenhill Academy approved', time: '2 min ago' },
    { icon: AlertCircle, color: 'text-amber-500', text: 'St. Mary\'s overdue payment', time: '15 min ago' },
    { icon: Building2, color: 'text-blue-500', text: 'New school application: Kabale PS', time: '1 hr ago' },
    { icon: Users, color: 'text-purple-500', text: '3 new teachers registered', time: '2 hr ago' },
    { icon: DollarSign, color: 'text-emerald-500', text: 'Payment received: UGX 400,000', time: '3 hr ago' },
]

export default function SAHome() {
    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="page-title">Platform Overview</h1>
                    <p className="page-subtitle">Welcome back! Here's your platform summary for today.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Schools" value="247" subtitle="+12 this month" icon={Building2} color="blue" trend="up" trendValue="5.1% vs last month" />
                    <StatCard title="Total Students" value="68,430" subtitle="Across all schools" icon={GraduationCap} color="green" trend="up" trendValue="8.3% growth" />
                    <StatCard title="Monthly Revenue" value="UGX 112M" subtitle="Feb 2026" icon={DollarSign} color="purple" trend="up" trendValue="14.3% vs Jan" />
                    <StatCard title="Active Schools" value="231" subtitle="16 pending approval" icon={CheckCircle} color="amber" trend="up" trendValue="93.5% active rate" />
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Teachers" value="4,218" icon={Users} color="indigo" />
                    <StatCard title="Pending Applications" value="16" icon={Clock} color="amber" />
                    <StatCard title="Overdue Payments" value="23" icon={AlertCircle} color="red" />
                    <StatCard title="Support Tickets" value="47" subtitle="12 critical" icon={AlertCircle} color="red" />
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card lg:col-span-2">
                        <h2 className="section-title">Revenue Growth</h2>
                        <LineChart data={revenueData} />
                    </div>
                    <div className="card">
                        <h2 className="section-title">Schools by District</h2>
                        <DoughnutChart data={districtData} />
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="section-title">Monthly School Registrations</h2>
                        <BarChart data={schoolGrowthData} />
                    </div>
                    <div className="card">
                        <h2 className="section-title">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <a.icon size={16} className={`mt-0.5 flex-shrink-0 ${a.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-700">{a.text}</p>
                                        <p className="text-xs text-gray-400">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
