import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { BarChart } from '../../components/charts/Charts'
import { Plus, Edit2, Bell, Download, DollarSign, Search } from 'lucide-react'

const feeStructures = [
    { class: 'P1 - P4', tuition: '450,000', lunch: '120,000', activities: '50,000', total: '620,000' },
    { class: 'P5 - P7', tuition: '550,000', lunch: '120,000', activities: '60,000', total: '730,000' },
    { class: 'Boarding', tuition: '650,000', lunch: '0', activities: '80,000', total: '1,230,000' },
]

const payments = [
    { parent: 'Mary Namukasa', student: 'Ivan Namukasa', class: 'P7', amount: '730,000', paid: '730,000', balance: '0', date: '2026-02-10', method: 'MTN MoMo', status: 'paid' },
    { parent: 'Patricia Ouma', student: 'David Ouma', class: 'P5', amount: '730,000', paid: '365,000', balance: '365,000', date: '2026-02-15', method: 'Cash', status: 'partial' },
    { parent: 'Daniel Ssali', student: 'Faith Ssali', class: 'P4', amount: '620,000', paid: '0', balance: '620,000', date: '—', method: '—', status: 'overdue' },
    { parent: 'John Mukasa', student: 'Grace Mukasa', class: 'P6', amount: '730,000', paid: '730,000', balance: '0', date: '2026-02-08', method: 'Airtel Money', status: 'paid' },
]

const collectionChart = {
    labels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'],
    datasets: [
        { label: 'Collected', data: [95, 88, 92, 76, 84, 91, 78], backgroundColor: '#2563eb', borderRadius: 6 },
        { label: 'Outstanding', data: [5, 12, 8, 24, 16, 9, 22], backgroundColor: '#bfdbfe', borderRadius: 6 },
    ],
}

export default function SchoolAdminFees() {
    const [modal, setModal] = useState(null)
    const [search, setSearch] = useState('')
    const filteredPayments = payments.filter(p => p.parent.toLowerCase().includes(search.toLowerCase()) || p.student.toLowerCase().includes(search.toLowerCase()))

    return (
        <DashboardLayout role="schooladmin-primary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Fees & Payments</h1><p className="page-subtitle">Fee structures, collection tracking, and reminders</p></div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('remind')}><Bell size={15} /> Send Reminders</button>
                        <button className="btn-secondary"><Download size={15} /> Export</button>
                    </div>
                </div>

                {/* Fee Structure */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title mb-0">Fee Structure — Term 1, 2026</h2>
                        <button className="btn-primary text-xs py-1.5 px-3" onClick={() => setModal('editFee')}><Edit2 size={13} /> Edit Structure</button>
                    </div>
                    <table className="w-full">
                        <thead><tr>{['Class', 'Tuition (UGX)', 'Lunch', 'Activities', 'Total / Term'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {feeStructures.map(f => (
                                <tr key={f.class} className="hover:bg-blue-50/30">
                                    <td className="table-cell font-semibold">{f.class}</td>
                                    <td className="table-cell">{f.tuition}</td>
                                    <td className="table-cell">{f.lunch}</td>
                                    <td className="table-cell">{f.activities}</td>
                                    <td className="table-cell font-bold text-primary-700">{f.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Collection chart */}
                <div className="card"><h2 className="section-title">Collection Rate by Class (%)</h2><BarChart data={collectionChart} /></div>

                {/* Payments table */}
                <div className="card p-0">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">Payment Records</h2>
                        <div className="relative w-64"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search..." /></div>
                    </div>
                    <table className="w-full">
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
                    </table>
                </div>
            </div>

            <Modal isOpen={modal === 'remind'} onClose={() => setModal(null)} title="Send Fee Reminder"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Bell size={14} /> Send</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                        <select className="select-field"><option>All Overdue (3 parents)</option><option>Partial Payments (1 parent)</option><option>All Outstanding</option></select>
                    </div>
                    <div className="flex gap-4">{['SMS', 'Email', 'WhatsApp'].map(ch => <label key={ch} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" defaultChecked /><span className="text-sm">{ch}</span></label>)}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea className="input-field resize-none" rows={3} defaultValue="Dear Parent, kindly note that school fees for Term 1 2026 are due. Please pay UGX [amount] to avoid disruption to your child's learning. Thank you." />
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'editFee'} onClose={() => setModal(null)} title="Edit Fee Structure"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><DollarSign size={14} /> Save Structure</button></>}>
                <div className="space-y-4">
                    {feeStructures.map(f => (
                        <div key={f.class} className="p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm font-semibold text-gray-800 mb-3">{f.class}</p>
                            <div className="grid grid-cols-3 gap-3">
                                {[['Tuition', f.tuition], ['Lunch', f.lunch], ['Activities', f.activities]].map(([k, v]) => (
                                    <div key={k}><label className="block text-xs text-gray-500 mb-1">{k}</label><input className="input-field" defaultValue={v} /></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </DashboardLayout>
    )
}
