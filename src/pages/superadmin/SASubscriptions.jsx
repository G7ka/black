import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { BarChart, LineChart } from '../../components/charts/Charts'
import { Plus, Edit2, Bell, RefreshCw, AlertCircle, Check } from 'lucide-react'

const plans = [
    { name: 'Basic', price: '200,000', schools: 89, features: ['Up to 500 students', 'Basic reports', 'SMS notifications', '5 GB storage'] },
    { name: 'Pro', price: '400,000', schools: 124, features: ['Up to 2,000 students', 'Advanced analytics', 'SMS & Email', '20 GB storage', 'Parent portal'] },
    { name: 'Enterprise', price: '800,000', schools: 34, features: ['Unlimited students', 'Custom reports', 'Priority support', 'Unlimited storage', 'API access'] },
]

const invoices = [
    { id: 'INV-0241', school: 'Greenhill Academy', amount: '400,000', date: '2026-02-01', due: '2026-02-15', status: 'paid' },
    { id: 'INV-0242', school: 'Aga Khan School', amount: '400,000', date: '2026-02-01', due: '2026-02-15', status: 'paid' },
    { id: 'INV-0243', school: "St. Mary's College", amount: '200,000', date: '2026-01-01', due: '2026-01-15', status: 'overdue' },
    { id: 'INV-0244', school: 'Nile International', amount: '800,000', date: '2026-02-01', due: '2026-02-15', status: 'paid' },
    { id: 'INV-0245', school: 'Buganda Road PS', amount: '200,000', date: '2025-12-01', due: '2025-12-15', status: 'overdue' },
    { id: 'INV-0246', school: 'Kabale Primary', amount: '200,000', date: '2026-02-01', due: '2026-02-28', status: 'pending' },
]

const revenueByMonth = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
        { label: 'Basic (UGX M)', data: [12, 14, 16, 17, 17, 17.8], backgroundColor: '#93c5fd', borderRadius: 6 },
        { label: 'Pro (UGX M)', data: [28, 34, 40, 46, 48, 49.6], backgroundColor: '#3b82f6', borderRadius: 6 },
        { label: 'Enterprise (UGX M)', data: [20, 22, 24, 26, 27, 27.2], backgroundColor: '#1d4ed8', borderRadius: 6 },
    ],
}

export default function SASubscriptions() {
    const [modal, setModal] = useState(null)
    const [tab, setTab] = useState('invoices')

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Subscriptions & Billing</h1><p className="page-subtitle">Manage plans, invoices, and payment tracking</p></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {plans.map(p => (
                        <div key={p.name} className={`card border-2 ${p.name === 'Pro' ? 'border-primary-500 shadow-lg shadow-blue-100' : 'border-gray-100'}`}>
                            {p.name === 'Pro' && <div className="text-center mb-3"><span className="badge bg-primary-100 text-primary-700 text-xs">MOST POPULAR</span></div>}
                            <div className="text-center">
                                <h3 className="text-lg font-bold">{p.name}</h3>
                                <p className="text-2xl font-bold text-primary-600 mt-1">UGX {p.price}</p>
                                <p className="text-xs text-gray-400">per month • {p.schools} schools</p>
                            </div>
                            <ul className="mt-4 space-y-2">
                                {p.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><Check size={13} className="text-emerald-500 flex-shrink-0" />{f}</li>)}
                            </ul>
                            <button className="btn-secondary w-full mt-4 justify-center" onClick={() => setModal('editPlan')}><Edit2 size={14} /> Edit Plan</button>
                        </div>
                    ))}
                </div>
                <button className="btn-primary" onClick={() => setModal('addPlan')}><Plus size={16} /> Create New Plan</button>

                <div className="card"><h2 className="section-title">Revenue by Plan</h2><BarChart data={revenueByMonth} /></div>

                <div className="card p-0">
                    <div className="flex border-b border-gray-100">
                        {['invoices', 'overdue', 'refunds'].map(t => (
                            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {t}{t === 'overdue' && <span className="ml-1 badge bg-red-100 text-red-600 text-xs">2</span>}
                            </button>
                        ))}
                    </div>
                    {tab === 'invoices' && (
                        <table className="w-full">
                            <thead><tr>{['Invoice #', 'School', 'Amount (UGX)', 'Issue Date', 'Due Date', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {invoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-mono text-xs text-blue-600 font-semibold">{inv.id}</td>
                                        <td className="table-cell font-medium">{inv.school}</td>
                                        <td className="table-cell font-semibold">{inv.amount}</td>
                                        <td className="table-cell text-gray-500 text-xs">{inv.date}</td>
                                        <td className="table-cell text-gray-500 text-xs">{inv.due}</td>
                                        <td className="table-cell"><Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}>{inv.status}</Badge></td>
                                        <td className="table-cell"><div className="flex gap-1"><button className="btn-secondary text-xs py-1 px-2">View</button>{inv.status !== 'paid' && <button className="btn-primary text-xs py-1 px-2" onClick={() => setModal('reminder')}><Bell size={11} />Remind</button>}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {tab === 'overdue' && (
                        <div className="p-6 space-y-3">
                            {invoices.filter(i => i.status === 'overdue').map(inv => (
                                <div key={inv.id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                                    <div className="flex items-center gap-3"><AlertCircle size={18} className="text-red-500" /><div><p className="text-sm font-semibold">{inv.school}</p><p className="text-xs text-gray-500">Due: {inv.due} · UGX {inv.amount}</p></div></div>
                                    <div className="flex gap-2"><button className="btn-secondary text-xs py-1 px-3" onClick={() => setModal('reminder')}><Bell size={11} /> Remind</button><button className="btn-danger text-xs py-1 px-3">Suspend</button></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {tab === 'refunds' && <div className="p-12 text-center text-gray-400"><RefreshCw size={40} className="mx-auto mb-3 opacity-30" /><p className="text-sm">No pending refund requests</p></div>}
                </div>
            </div>

            <Modal isOpen={modal === 'addPlan' || modal === 'editPlan'} onClose={() => setModal(null)} title={modal === 'addPlan' ? 'Create Plan' : 'Edit Plan'}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Check size={14} /> Save</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label><input className="input-field" defaultValue={modal === 'editPlan' ? 'Pro' : ''} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (UGX)</label><input className="input-field" type="number" defaultValue={modal === 'editPlan' ? '400000' : ''} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label><input className="input-field" type="number" placeholder="Blank = unlimited" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label><textarea className="input-field resize-none" rows={4} defaultValue="Up to 2,000 students" /></div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'reminder'} onClose={() => setModal(null)} title="Send Payment Reminder"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Bell size={14} /> Send</button></>}>
                <div className="space-y-4">
                    <div className="flex gap-4 flex-wrap">{['Email', 'SMS', 'In-app'].map(ch => <label key={ch} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked /><span className="text-sm">{ch}</span></label>)}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea className="input-field resize-none" rows={3} defaultValue="Dear Admin, your invoice is overdue. Please process payment to avoid service suspension." /></div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
