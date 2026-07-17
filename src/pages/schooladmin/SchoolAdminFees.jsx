import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { BarChart } from '../../components/charts/Charts'
import { Edit2, Bell, Download, Search, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { classesApi } from '../../api/classes.api'
import { feesApi } from '../../api/schoolOps.api'

const CURRENT_TERM = 'Term 1 2026'
const fmt = (n) => Number(n).toLocaleString('en-UG')

export default function SchoolAdminFees({ section = 'all', role = 'schooladmin-primary' }) {
    const [modal, setModal] = useState(null)
    const [search, setSearch] = useState('')
    const [classes, setClasses] = useState([])
    const [feeStructure, setFeeStructure] = useState([])
    const [payments, setPayments] = useState([])
    const [editFees, setEditFees] = useState([])
    const [successMsg, setSuccessMsg] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [remindTarget, setRemindTarget] = useState(null)

    const showFees = section === 'all' || section === 'fees'
    const showPayments = section === 'all' || section === 'payments'

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            const [classesResult, structuresResult, paymentsResult] = await Promise.all([
                classesApi.list(),
                feesApi.listStructures(),
                feesApi.listPaymentStatus(CURRENT_TERM),
            ])
            setClasses(classesResult)
            setFeeStructure(structuresResult)
            setPayments(paymentsResult)
        } catch (err) {
            setLoadError(err.message || 'Failed to load fees data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const structureByClass = (classId) => feeStructure.find(f => f.classId === classId)

    const filteredPayments = payments.filter(p => p.studentName.toLowerCase().includes(search.toLowerCase()) || p.parent.toLowerCase().includes(search.toLowerCase()))

    const openEditFees = () => {
        setEditFees(classes.map(c => {
            const s = structureByClass(c.id)
            return { classId: c.id, className: c.name, tuition: s?.tuition || 0, lunch: s?.lunch || 0, activities: s?.activities || 0 }
        }))
        setModal('editFee')
        setActionError('')
    }

    const updateFee = (classId, field, value) => {
        setEditFees(prev => prev.map(f => f.classId === classId ? { ...f, [field]: Number(value) || 0 } : f))
    }

    const saveFees = async () => {
        setActionLoading(true); setActionError('')
        try {
            await Promise.all(editFees.map(f => feesApi.saveStructure({ classId: f.classId, term: CURRENT_TERM, tuition: f.tuition, lunch: f.lunch, activities: f.activities })))
            setModal(null)
            setSuccessMsg('Fee structure updated successfully!')
            setTimeout(() => setSuccessMsg(''), 3500)
            await load()
        } catch (err) {
            setActionError(err.message || 'Failed to save fee structure')
        } finally {
            setActionLoading(false)
        }
    }

    const sendReminder = async () => {
        if (!remindTarget) return
        setActionLoading(true); setActionError('')
        try {
            await feesApi.sendReminder(remindTarget.studentId, CURRENT_TERM)
            setModal(null)
            setSuccessMsg(`Reminder sent for ${remindTarget.studentName}.`)
            setTimeout(() => setSuccessMsg(''), 3500)
        } catch (err) {
            setActionError(err.message || 'Failed to send reminder')
        } finally {
            setActionLoading(false)
        }
    }

    const collectionChart = {
        labels: feeStructure.map(f => classes.find(c => c.id === f.classId)?.name || ''),
        datasets: [{
            label: 'Total Fee Structure (UGX)',
            data: feeStructure.map(f => f.tuition + f.lunch + f.activities),
            backgroundColor: '#2563eb',
            borderRadius: 6,
        }],
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative">
                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600" /><span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">{showFees && !showPayments ? 'Fee Structure' : showPayments && !showFees ? 'Payments' : 'Fees & Payments'}</h1>
                        <p className="page-subtitle">{showFees && !showPayments ? 'Set and manage class fee structure per term' : showPayments && !showFees ? 'Track all fee collection and payment records' : 'Set class fees, track collection, and send reminders'}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {showPayments && <button className="btn-secondary" disabled title="Export not wired up yet"><Download size={15} /> Export</button>}
                    </div>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}
                {loading && <p className="text-sm text-gray-400">Loading…</p>}

                {!loading && showFees && (
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="section-title mb-0">Fee Structure — {CURRENT_TERM}</h2>
                            <button className="btn-primary text-xs py-1.5 px-3" onClick={openEditFees}><Edit2 size={13} /> Edit Fees</button>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Class', 'Tuition (UGX)', 'Lunch (UGX)', 'Activities (UGX)', 'Total / Term (UGX)'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {classes.map(c => {
                                    const s = structureByClass(c.id)
                                    const total = s ? s.tuition + s.lunch + s.activities : 0
                                    return (
                                        <tr key={c.id} className="hover:bg-blue-50/30">
                                            <td className="table-cell font-semibold text-gray-900">{c.name}</td>
                                            <td className="table-cell text-sm">{fmt(s?.tuition || 0)}</td>
                                            <td className="table-cell text-sm">{fmt(s?.lunch || 0)}</td>
                                            <td className="table-cell text-sm">{fmt(s?.activities || 0)}</td>
                                            <td className="table-cell font-bold text-primary-700">{fmt(total)}</td>
                                        </tr>
                                    )
                                })}
                                {classes.length === 0 && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-6">No classes yet.</td></tr>}
                            </tbody>
                        </table></div>
                    </div>
                )}

                {!loading && showPayments && feeStructure.length > 0 && (
                    <div className="card"><h2 className="section-title">Fee Structure Totals by Class (UGX)</h2><BarChart data={collectionChart} /></div>
                )}

                {!loading && showPayments && (
                    <div className="card p-0">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800">Payment Records — {CURRENT_TERM}</h2>
                            <div className="relative w-64"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search..." /></div>
                        </div>
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Parent', 'Student', 'Class', 'Expected', 'Paid', 'Balance', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {filteredPayments.map((p) => (
                                    <tr key={p.studentId} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-medium">{p.parent}</td>
                                        <td className="table-cell text-gray-600">{p.studentName}</td>
                                        <td className="table-cell"><Badge variant="info">{p.className}</Badge></td>
                                        <td className="table-cell text-sm">UGX {fmt(p.expected)}</td>
                                        <td className="table-cell text-sm text-emerald-700 font-medium">UGX {fmt(p.paid)}</td>
                                        <td className="table-cell text-sm text-red-600 font-semibold">{p.balance === 0 ? '—' : 'UGX ' + fmt(p.balance)}</td>
                                        <td className="table-cell"><Badge variant={p.status === 'PAID' ? 'success' : p.status === 'PARTIAL' ? 'warning' : 'danger'}>{p.status.toLowerCase()}</Badge></td>
                                        <td className="table-cell">
                                            <div className="flex gap-1">
                                                {p.status !== 'PAID' && <button className="btn-primary text-xs py-1 px-2" onClick={() => { setRemindTarget(p); setModal('remind'); setActionError('') }}><Bell size={11} /> Remind</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPayments.length === 0 && <tr><td colSpan={8} className="table-cell text-center text-gray-400 py-8">No students found.</td></tr>}
                            </tbody>
                        </table></div>
                    </div>
                )}
            </div>

            <Modal isOpen={modal === 'remind'} onClose={() => setModal(null)} title="Send Fee Reminder"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={sendReminder}><Bell size={14} /> {actionLoading ? 'Sending…' : 'Send'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    {remindTarget && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                            <p className="font-semibold text-gray-800">{remindTarget.studentName}</p>
                            <p className="text-gray-500">Balance: UGX {fmt(remindTarget.balance)}</p>
                        </div>
                    )}
                    <p className="text-xs text-gray-500">Sent by email to the parent's registered address.</p>
                </div>
            </Modal>

            <Modal isOpen={modal === 'editFee'} onClose={() => setModal(null)} title="Edit Fee Structure (Per Class)" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveFees}><Save size={14} /> {actionLoading ? 'Saving…' : 'Save Structure'}</button></>}>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    {editFees.map(f => (
                        <div key={f.classId} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-bold text-gray-900">{f.className}</p>
                                <p className="text-xs font-semibold text-blue-600">Total: UGX {fmt(f.tuition + f.lunch + f.activities)}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div><label className="block text-xs text-gray-500 mb-1">Tuition</label><input type="number" className="input-field" value={f.tuition} onChange={e => updateFee(f.classId, 'tuition', e.target.value)} /></div>
                                <div><label className="block text-xs text-gray-500 mb-1">Lunch</label><input type="number" className="input-field" value={f.lunch} onChange={e => updateFee(f.classId, 'lunch', e.target.value)} /></div>
                                <div><label className="block text-xs text-gray-500 mb-1">Activities</label><input type="number" className="input-field" value={f.activities} onChange={e => updateFee(f.classId, 'activities', e.target.value)} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </DashboardLayout>
    )
}
