import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { LineChart, BarChart } from '../../components/charts/Charts'
import { Users, GraduationCap, DollarSign, TrendingUp, Plus, Upload, FileText, Bell, AlertCircle } from 'lucide-react'

const enrollmentData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [{ label: 'Enrolled Students', data: [820, 840, 850, 855, 860, 855, 870, 900, 930, 950, 960, 975, 985], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#2563eb', pointRadius: 4 }],
}
const feeData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'Fees Collected (UGX M)', data: [12.4, 15.2, 14.8, 18.1, 22.3], backgroundColor: '#2563eb', borderRadius: 6 },
        { label: 'Fees Expected (UGX M)', data: [18, 18, 18, 24, 28], backgroundColor: '#bfdbfe', borderRadius: 6 },
    ],
}

const recentPayments = [
    { parent: 'Mary Namukasa', student: 'Ivan Namukasa', amount: '450,000', date: '2026-02-22', status: 'paid' },
    { parent: 'John Mukasa', student: 'Grace Mukasa', amount: '450,000', date: '2026-02-21', status: 'paid' },
    { parent: 'Patricia Ouma', student: 'David Ouma', amount: '225,000', date: '2026-02-20', status: 'partial' },
    { parent: 'Daniel Ssali', student: 'Samuel Ssali', amount: '0', date: '—', status: 'overdue' },
]

export default function SecondaryAdminHome() {
    const [modal, setModal] = useState(null)
    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title">School Dashboard</h1>
                        <p className="page-subtitle">Kampala Primary School — Term 1, 2026</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('import')}><Upload size={15} /> Import Students</button>
                        <button className="btn-primary" onClick={() => setModal('enroll')}><Plus size={15} /> Enroll Student</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Students" value="985" subtitle="+15 this term" icon={GraduationCap} color="blue" trend="up" trendValue="+1.5%" />
                    <StatCard title="Teachers" value="42" subtitle="3 on leave" icon={Users} color="green" />
                    <StatCard title="Fees Collected" value="UGX 22.3M" subtitle="Feb 2026" icon={DollarSign} color="purple" trend="up" trendValue="79.6% collected" />
                    <StatCard title="Attendance Rate" value="91.4%" subtitle="This week" icon={TrendingUp} color="amber" trend="up" trendValue="+2.1%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card"><h2 className="section-title">Enrollment Trend</h2><LineChart data={enrollmentData} /></div>
                    <div className="card"><h2 className="section-title">Fee Collection vs Expected</h2><BarChart data={feeData} /></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="section-title">Recent Payments</h2>
                        <table className="w-full">
                            <thead><tr>{['Parent', 'Student', 'Amount', 'Status'].map(h => <th key={h} className="table-header text-xs">{h}</th>)}</tr></thead>
                            <tbody>
                                {recentPayments.map((p, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30">
                                        <td className="table-cell text-sm font-medium">{p.parent}</td>
                                        <td className="table-cell text-sm text-gray-500">{p.student}</td>
                                        <td className="table-cell text-sm">UGX {p.amount}</td>
                                        <td className="table-cell"><Badge variant={p.status === 'paid' ? 'success' : p.status === 'partial' ? 'warning' : 'danger'}>{p.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card">
                        <h2 className="section-title">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Send Reminder', icon: Bell, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                                { label: 'Generate Report', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                                { label: 'View Overdue', icon: AlertCircle, color: 'bg-red-50 text-red-700 border-red-200' },
                                { label: 'Add Teacher', icon: Plus, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                            ].map(a => (
                                <button key={a.label} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all hover:shadow-md ${a.color}`}>
                                    <a.icon size={22} />{a.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'enroll'} onClose={() => setModal(null)} title="Enroll New Student" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><GraduationCap size={14} /> Enroll Student</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    {[['First Name', 'text', 'John'], ['Last Name', 'text', 'Doe'], ['Date of Birth', 'date', ''], ['Gender', 'select', ''], ['Class', 'select', ''], ['Parent Name', 'text', ''], ['Parent Phone', 'tel', '+256 700 000000'], ['Parent Email', 'email', '']].map(([label, type, ph]) => (
                        <div key={label}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            {type === 'select' ? <select className="select-field"><option>{label === 'Class' ? 'Select class' : 'Select gender'}</option>{label === 'Class' ? ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'].map(c => <option key={c}>{c}</option>) : ['Male', 'Female'].map(g => <option key={g}>{g}</option>)}</select> : <input type={type} className="input-field" placeholder={ph} />}
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal isOpen={modal === 'import'} onClose={() => setModal(null)} title="Import Students from Excel"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Upload size={14} /> Import</button></>}>
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">Drop Excel file here or click to browse</p>
                        <p className="text-xs text-gray-400 mt-1">Supports .xlsx and .csv</p>
                    </div>
                    <a href="#" className="text-sm text-primary-600 font-medium flex items-center gap-1"><FileText size={13} /> Download template</a>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
