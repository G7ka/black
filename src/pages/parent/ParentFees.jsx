import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { DollarSign, CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle, Download, ArrowRight } from 'lucide-react'

const invoices = [
    { id: 'INV-2026-T1', term: 'Term 1, 2026', total: 730000, paid: 365000, balance: 365000, due: '2026-03-01', status: 'partial' },
    { id: 'INV-2025-T3', term: 'Term 3, 2025', total: 730000, paid: 730000, balance: 0, due: '2025-10-01', status: 'paid' },
    { id: 'INV-2025-T2', term: 'Term 2, 2025', total: 680000, paid: 680000, balance: 0, due: '2025-06-01', status: 'paid' },
]

const ugxFmt = (n) => `UGX ${n.toLocaleString()}`

export default function ParentFees() {
    const [modal, setModal] = useState(null)
    const [method, setMethod] = useState('momo')
    const [paid, setPaid] = useState(false)

    const handlePay = () => { setPaid(true); setModal(null) }

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div><h1 className="page-title">Fees & Payments</h1><p className="page-subtitle">Ivan Namukasa's fee history and outstanding balance</p></div>

                {/* Current invoice */}
                <div className="card border-2 border-amber-300 bg-amber-50/50">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-600" /><h2 className="font-bold text-gray-900 text-lg">Outstanding Balance</h2></div>
                            <p className="text-3xl font-extrabold text-amber-700">{ugxFmt(365000)}</p>
                            <p className="text-sm text-gray-600 mt-1">Term 1, 2026 · Due March 1, 2026</p>
                            <p className="text-xs text-gray-500 mt-0.5">Tuition {ugxFmt(550000)} + Activities {ugxFmt(60000)} + Lunch {ugxFmt(120000)} = {ugxFmt(730000)}</p>
                        </div>
                        <button onClick={() => setModal('pay')} className="btn-primary px-6 py-3 text-base flex items-center gap-2">
                            <CreditCard size={18} /> Pay Now <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Paid: {ugxFmt(365000)}</span><span>Total: {ugxFmt(730000)}</span></div>
                        <div className="w-full bg-amber-200 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }} /></div>
                        <p className="text-xs text-amber-600 font-medium mt-1">50% paid</p>
                    </div>
                </div>

                {/* Invoice history */}
                <div className="card p-0">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Payment History</h2></div>
                    <table className="w-full">
                        <thead><tr>{['Invoice', 'Term', 'Total', 'Paid', 'Balance', 'Due Date', 'Status', ''].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-blue-50/30">
                                    <td className="table-cell font-mono text-xs text-blue-600">{inv.id}</td>
                                    <td className="table-cell font-medium">{inv.term}</td>
                                    <td className="table-cell">{ugxFmt(inv.total)}</td>
                                    <td className="table-cell text-emerald-700 font-semibold">{ugxFmt(inv.paid)}</td>
                                    <td className="table-cell text-red-600 font-semibold">{inv.balance > 0 ? ugxFmt(inv.balance) : '—'}</td>
                                    <td className="table-cell text-xs text-gray-400">{inv.due}</td>
                                    <td className="table-cell"><Badge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status}</Badge></td>
                                    <td className="table-cell"><button className="btn-secondary text-xs py-1 px-2"><Download size={11} /> Receipt</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal isOpen={modal === 'pay'} onClose={() => setModal(null)} title="Pay School Fees" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={handlePay}><CheckCircle size={14} /> Confirm Payment</button></>}>
                <div className="space-y-5">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm font-semibold text-blue-900">Paying for: Ivan Namukasa — Term 1, 2026</p>
                        <p className="text-lg font-bold text-primary-600 mt-1">{ugxFmt(365000)} outstanding</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Pay</label>
                        <input type="number" className="input-field" defaultValue={365000} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[['momo', Smartphone, 'MTN Mobile Money', 'from-yellow-400 to-orange-500'],
                            ['airtel', Smartphone, 'Airtel Money', 'from-red-500 to-red-700'],
                            ['card', CreditCard, 'Bank/Card', 'from-blue-500 to-blue-700']].map(([key, Icon, label, grad]) => (
                                <button key={key} onClick={() => setMethod(key)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${method === key ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center`}><Icon size={14} className="text-white" /></div>
                                    <p className="text-xs font-semibold text-gray-700 text-center">{label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    {(method === 'momo' || method === 'airtel') && (
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile Money Number</label>
                            <input className="input-field" placeholder={method === 'momo' ? '+256 77X XXX XXX' : '+256 75X XXX XXX'} defaultValue="+256 772 111222" />
                            <p className="text-xs text-gray-400 mt-1">You will receive a payment prompt on your phone. Enter PIN to complete.</p>
                        </div>
                    )}
                </div>
            </Modal>

            {paid && (
                <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
                    <CheckCircle size={18} /> Payment Successful!
                </div>
            )}
        </DashboardLayout>
    )
}
