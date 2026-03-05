import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { BarChart } from '../../components/charts/Charts'
import { Plus, Edit2, Bell, Download, DollarSign, Search, Save, CheckCircle2, Trash2 } from 'lucide-react'

const initialFeeStructure = [
    { id: 1, className: 'P.1', tuition: 200000, lunch: 80000, activities: 30000 },
    { id: 2, className: 'P.2', tuition: 200000, lunch: 80000, activities: 30000 },
    { id: 3, className: 'P.3', tuition: 250000, lunch: 80000, activities: 30000 },
    { id: 4, className: 'P.4', tuition: 250000, lunch: 80000, activities: 40000 },
    { id: 5, className: 'P.5', tuition: 350000, lunch: 100000, activities: 50000 },
    { id: 6, className: 'P.6', tuition: 350000, lunch: 100000, activities: 50000 },
    { id: 7, className: 'P.7', tuition: 450000, lunch: 120000, activities: 60000 },
]

const payments = [
    { parent: 'Mary Namukasa', student: 'Ivan Namukasa', class: 'P7', amount: '630,000', paid: '630,000', balance: '0', date: '2026-02-10', method: 'MTN MoMo', status: 'paid' },
    { parent: 'Patricia Ouma', student: 'David Ouma', class: 'P5', amount: '500,000', paid: '250,000', balance: '250,000', date: '2026-02-15', method: 'Cash', status: 'partial' },
    { parent: 'Daniel Ssali', student: 'Faith Ssali', class: 'P4', amount: '320,000', paid: '0', balance: '320,000', date: '—', method: '—', status: 'overdue' },
    { parent: 'John Mukasa', student: 'Grace Mukasa', class: 'P6', amount: '500,000', paid: '500,000', balance: '0', date: '2026-02-08', method: 'Airtel Money', status: 'paid' },
]

const collectionChart = {
    labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'],
    datasets: [
        { label: 'Collected', data: [95, 88, 92, 76, 84, 91, 78], backgroundColor: '#2563eb', borderRadius: 6 },
        { label: 'Outstanding', data: [5, 12, 8, 24, 16, 9, 22], backgroundColor: '#bfdbfe', borderRadius: 6 },
    ],
}

const fmt = (n) => Number(n).toLocaleString('en-UG')

export default function SchoolAdminFees({ section = 'all', role = 'schooladmin-primary' }) {
    const [modal, setModal] = useState(null)
    const [search, setSearch] = useState('')
    const [feeStructure, setFeeStructure] = useState(initialFeeStructure)
    const [editFees, setEditFees] = useState(initialFeeStructure.map(f => ({ ...f })))
    const [successMsg, setSuccessMsg] = useState('')

    const filteredPayments = payments.filter(p => p.parent.toLowerCase().includes(search.toLowerCase()) || p.student.toLowerCase().includes(search.toLowerCase()))

    const openEditFees = () => {
        setEditFees(feeStructure.map(f => ({ ...f })))
        setModal('editFee')
    }

    const updateFee = (id, field, value) => {
        setEditFees(prev => prev.map(f => f.id === id ? { ...f, [field]: Number(value) || 0 } : f))
    }

    const saveFees = () => {
        setFeeStructure(editFees.map(f => ({ ...f })))
        setModal(null)
        setSuccessMsg('Fee structure updated successfully!')
        setTimeout(() => setSuccessMsg(''), 3500)
    }

    const showFees = section === 'all' || section === 'fees'
    const showPayments = section === 'all' || section === 'payments'

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative">

                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">{showFees && !showPayments ? 'Fee Structure' : showPayments && !showFees ? 'Payments' : 'Fees & Payments'}</h1>
                        <p className="page-subtitle">{showFees && !showPayments ? 'Set and manage class fee structure per term' : showPayments && !showFees ? 'Track all fee collection and payment records' : 'Set class fees, track collection, and send reminders'}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {showPayments && <button className="btn-secondary" onClick={() => setModal('remind')}><Bell size={15} /> Send Reminders</button>}
                        {showPayments && <button className="btn-secondary"><Download size={15} /> Export</button>}
                    </div>
                </div>

                {/* Fee Structure — one row per class */}
                {showFees && (
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title mb-0">Fee Structure — Term 1, 2026</h2>
                            <button className="btn-primary text-xs py-1.5 px-3" onClick={openEditFees}><Edit2 size={13} /> Edit Fees</button>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Class', 'Tuition (UGX)', 'Lunch (UGX)', 'Activities (UGX)', 'Total / Term (UGX)'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {feeStructure.map(f => {
                                    const total = f.tuition + f.lunch + f.activities
                                    return (
                                        <tr key={f.id} className="hover:bg-blue-50/30">
                                            <td className="table-cell font-semibold text-gray-900">{f.className}</td>
                                            <td className="table-cell text-sm">{fmt(f.tuition)}</td>
                                            <td className="table-cell text-sm">{fmt(f.lunch)}</td>
                                            <td className="table-cell text-sm">{fmt(f.activities)}</td>
                                            <td className="table-cell font-bold text-primary-700">{fmt(total)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table></div>
                    </div>
                )}

                {/* Collection chart */}
                {showPayments && <div className="card"><h2 className="section-title">Collection Rate by Class (%)</h2><BarChart data={collectionChart} /></div>}

                {/* Payments table */}
                {showPayments && (
                    <div className="card p-0">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Payment Records</h2>
                            <div className="relative w-64"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search..." /></div>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Parent', 'Student', 'Class', 'Expected', 'Paid', 'Balance', 'Method', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {filteredPayments.map((p, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-medium">{p.parent}</td>
                                        <td className="table-cell text-gray-600">{p.student}</td>
                                        <td className="table-cell"><Badge variant="info">{p.class}</Badge></td>
                                        <td className="table-cell text-sm">UGX {p.amount}</td>
                                        <td className="table-cell text-sm text-emerald-700 font-medium">UGX {p.paid}</td>
                                        <td className="table-cell text-sm text-red-600 font-semibold">{p.balance === '0' ? '—' : 'UGX ' + p.balance}</td>
                                        <td className="table-cell text-xs text-gray-500">{p.method}</td>
                                        <td className="table-cell"><Badge variant={p.status === 'paid' ? 'success' : p.status === 'partial' ? 'warning' : 'danger'}>{p.status}</Badge></td>
                                        <td className="table-cell">
                                            <div className="flex gap-1">
                                                {p.status !== 'paid' && <button className="btn-primary text-xs py-1 px-2" onClick={() => setModal('remind')}><Bell size={11} /> Remind</button>}
                                                <button className="btn-secondary text-xs py-1 px-2">Receipt</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    </div>
                )}
            </div>

            {/* Reminder Modal */}
            <Modal isOpen={modal === 'remind'} onClose={() => setModal(null)} title="Send Fee Reminder"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Bell size={14} /> Send</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                        <select className="select-field"><option>All Overdue (3 parents)</option><option>Partial Payments (1 parent)</option><option>All Outstanding</option></select>
                    </div>
                    <div className="flex gap-4">{['SMS', 'Email', 'WhatsApp'].map(ch => <label key={ch} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked /><span className="text-sm">{ch}</span></label>)}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea className="input-field resize-none" rows={3} defaultValue="Dear Parent, kindly note that school fees for Term 1 2026 are due. Please pay UGX [amount] to avoid disruption. Thank you." />
                    </div>
                </div>
            </Modal>

            {/* Edit Fee Structure Modal — per class */}
            <Modal isOpen={modal === 'editFee'} onClose={() => setModal(null)} title="Edit Fee Structure (Per Class)" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={saveFees}><Save size={14} /> Save Structure</button></>}>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {editFees.map(f => (
                        <div key={f.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-bold text-gray-900">{f.className}</p>
                                <p className="text-xs font-semibold text-blue-600">Total: UGX {fmt(f.tuition + f.lunch + f.activities)}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Tuition</label>
                                    <input type="number" className="input-field" value={f.tuition} onChange={e => updateFee(f.id, 'tuition', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Lunch</label>
                                    <input type="number" className="input-field" value={f.lunch} onChange={e => updateFee(f.id, 'lunch', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Activities</label>
                                    <input type="number" className="input-field" value={f.activities} onChange={e => updateFee(f.id, 'activities', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </DashboardLayout>
    )
}
