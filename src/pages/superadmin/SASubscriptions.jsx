import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Edit2, Bell, AlertCircle, Users, DollarSign, School, Save, Info, CreditCard, Copy, ExternalLink, RotateCcw, XOctagon } from 'lucide-react'
import { billingApi } from '../../api/billing.api'
import { paymentsApi } from '../../api/payments.api'

// Remove price limits - allow any price from 0 upwards
const MIN_PRICE = 0
const MAX_PRICE = 100000 // Set a reasonable upper limit, can be changed

function fmt(n) {
    if (n === '' || n === null || n === undefined || isNaN(n)) return '0'
    return Number(n).toLocaleString('en-UG')
}

export default function SASubscriptions() {
    const [modal, setModal] = useState(null)
    const [tab, setTab] = useState('schools')
    const [schools, setSchools] = useState([])
    const [summary, setSummary] = useState({ pricePerStudent: 0, totalActiveStudents: 0, monthlyRevenue: 0, overdueCount: 0, totalSchools: 0 })
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [draftPrice, setDraftPrice] = useState(0)
    const [reminderSchool, setReminderSchool] = useState(null)
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    // Pesapal payment flow state
    const [paymentSchool, setPaymentSchool] = useState(null)
    const [paymentLink, setPaymentLink] = useState(null)
    const [refundAmount, setRefundAmount] = useState('')
    const [refundRemarks, setRefundRemarks] = useState('')
    const [copied, setCopied] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const result = await billingApi.list()
            setSchools(result.schools)
            setSummary(result.summary)
        } catch (err) {
            setLoadError(err.message || 'Failed to load billing data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const openReminder = (school) => { setReminderSchool(school); setModal('reminder'); setActionError('') }

    const savePricing = async () => {
        setActionLoading(true)
        setActionError('')
        
        // Client-side validation - allow any non-negative number
        if (draftPrice === '' || draftPrice === null || draftPrice === undefined) {
            setActionError('Please enter a valid price')
            setActionLoading(false)
            return
        }
        
        const numPrice = Number(draftPrice)
        if (isNaN(numPrice)) {
            setActionError('Please enter a valid number')
            setActionLoading(false)
            return
        }
        
        if (numPrice < 0) {
            setActionError('Price cannot be negative')
            setActionLoading(false)
            return
        }
        
        try {
            await billingApi.setPrice(numPrice)
            await load()
            setModal(null)
        } catch (err) {
            setActionError(err.message || 'Failed to update price')
        } finally {
            setActionLoading(false)
        }
    }

    const sendReminder = async () => {
        setActionLoading(true)
        setActionError('')
        try {
            await billingApi.remind(reminderSchool.schoolId)
            setModal(null)
        } catch (err) {
            setActionError(err.message || 'Failed to send reminder')
        } finally {
            setActionLoading(false)
        }
    }

    const openPayment = async (school) => {
        setPaymentSchool(school)
        setPaymentLink(null)
        setModal('payment')
        setActionError('')
        setActionLoading(true)
        try {
            const result = await paymentsApi.initiate(school.schoolId)
            setPaymentLink(result)
        } catch (err) {
            setActionError(err.message || 'Failed to generate payment link')
        } finally {
            setActionLoading(false)
        }
    }

    const copyLink = () => {
        if (!paymentLink?.redirectUrl) return
        navigator.clipboard.writeText(paymentLink.redirectUrl).catch(() => { })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const openRefund = (school) => { setPaymentSchool(school); setRefundAmount(String(school.amount)); setRefundRemarks(''); setModal('refund'); setActionError('') }

    const submitRefund = async () => {
        setActionLoading(true)
        setActionError('')
        try {
            await paymentsApi.refund(paymentSchool.schoolId, Number(refundAmount), refundRemarks)
            setModal(null)
            await load()
        } catch (err) {
            setActionError(err.message || 'Refund request failed')
        } finally {
            setActionLoading(false)
        }
    }

    const cancelPayment = async (school) => {
        setActionLoading(true)
        setActionError('')
        try {
            await paymentsApi.cancel(school.schoolId)
            await load()
        } catch (err) {
            setActionError(err.message || 'Failed to cancel payment')
        } finally {
            setActionLoading(false)
        }
    }

    const overdueSchools = schools.filter((s) => s.status === 'OVERDUE')

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title">Subscriptions & Billing</h1>
                        <p className="page-subtitle">Per-student monthly billing — UGX {fmt(summary.pricePerStudent)} per student</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setDraftPrice(summary.pricePerStudent); setModal('pricing'); setActionError('') }}>
                        <Edit2 size={15} /> Set Price Per Student
                    </button>
                </div>

                {loadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {loadError}
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1"><Users size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Active Students</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{fmt(summary.totalActiveStudents)}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">across {summary.totalSchools} schools</p>
                    </div>
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1"><DollarSign size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Monthly Revenue</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">UGX {fmt(summary.monthlyRevenue)}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">@ {fmt(summary.pricePerStudent)}/student</p>
                    </div>
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1"><School size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Active Schools</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{summary.totalSchools}</p>
                    </div>
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1"><AlertCircle size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Overdue</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{summary.overdueCount}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">schools with unpaid bills</p>
                    </div>
                </div>

                {/* Schools table */}
                <div className="card p-0">
                    <div className="flex border-b border-gray-100 dark:border-slate-700 flex-wrap">
                        {['schools', 'overdue'].map(t => (
                            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                                {t}{t === 'overdue' && summary.overdueCount > 0 && <span className="ml-1 badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs">{summary.overdueCount}</span>}
                            </button>
                        ))}
                    </div>

                    {loading && <p className="p-6 text-sm text-gray-400">Loading billing data…</p>}

                    {!loading && tab === 'schools' && (
                        <div className="overflow-x-auto">
                            <div className="overflow-x-auto"><table className="w-full min-w-[640px]">
                                <thead><tr>
                                    {['School', 'Level', 'Students', 'Monthly Bill (UGX)', 'Due Date', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}
                                </tr></thead>
                                <tbody>
                                    {schools.map(s => (
                                        <tr key={s.schoolId} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                            <td className="table-cell font-semibold dark:text-white">{s.schoolName}</td>
                                            <td className="table-cell text-gray-500 dark:text-slate-400">{s.level}</td>
                                            <td className="table-cell">
                                                <span className="flex items-center gap-1 dark:text-slate-300"><Users size={13} className="text-gray-400 dark:text-slate-500" />{fmt(s.students)}</span>
                                            </td>
                                            <td className="table-cell font-semibold text-blue-700 dark:text-blue-400">{fmt(s.amount)}</td>
                                            <td className="table-cell text-gray-500 dark:text-slate-400 text-xs">{new Date(s.dueDate).toLocaleDateString()}</td>
                                            <td className="table-cell"><Badge variant={s.status === 'PAID' ? 'success' : s.status === 'OVERDUE' ? 'danger' : 'warning'}>{s.status.toLowerCase()}</Badge></td>
                                            <td className="table-cell">
                                                <div className="flex gap-1 flex-wrap">
                                                    {s.status !== 'PAID' && (
                                                        <>
                                                            <button className="btn-primary text-xs py-1 px-2" onClick={() => openPayment(s)}>
                                                                <CreditCard size={11} /> Pay via Pesapal
                                                            </button>
                                                            <button className="btn-secondary text-xs py-1 px-2" onClick={() => openReminder(s)}>
                                                                <Bell size={11} /> Remind
                                                            </button>
                                                            <button className="btn-secondary text-xs py-1 px-2" onClick={() => cancelPayment(s)} title="Cancel a pending/failed payment attempt for this school">
                                                                <XOctagon size={11} /> Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {s.status === 'PAID' && (
                                                        <button className="btn-secondary text-xs py-1 px-2" onClick={() => openRefund(s)}>
                                                            <RotateCcw size={11} /> Refund
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="table-cell font-bold text-gray-800 dark:text-slate-200" colSpan={3}>Total (active schools)</td>
                                        <td className="table-cell font-extrabold text-blue-700 dark:text-blue-400">{fmt(summary.monthlyRevenue)}</td>
                                        <td className="table-cell" colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table></div>
                        </div>
                    )}

                    {!loading && tab === 'overdue' && (
                        <div className="p-6 space-y-3">
                            {overdueSchools.length === 0 && <p className="text-sm text-gray-400">No overdue schools 🎉</p>}
                            {overdueSchools.map(s => (
                                <div key={s.schoolId} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle size={18} className="text-red-500 dark:text-red-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold dark:text-white">{s.schoolName}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">Due: {new Date(s.dueDate).toLocaleDateString()} · {fmt(s.students)} students · UGX {fmt(s.amount)}/mo</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-primary text-xs py-1 px-3" onClick={() => openPayment(s)}><CreditCard size={11} /> Pay via Pesapal</button>
                                        <button className="btn-secondary text-xs py-1 px-3" onClick={() => openReminder(s)}><Bell size={11} /> Remind</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Set Price Per Student Modal ── */}
            <Modal isOpen={modal === 'pricing'} onClose={() => setModal(null)} title="Set Price Per Student"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={savePricing}><Save size={14} /> {actionLoading ? 'Saving…' : 'Save Pricing'}</button></>}>
                <div className="space-y-5">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                        <Info size={18} className="flex-shrink-0 mt-0.5 text-blue-500 dark:text-blue-400" />
                        <div>
                            <p className="font-semibold mb-1">Per-Student Monthly Billing</p>
                            <p>Each school is billed based on their number of enrolled students × this rate. The rate applies to all schools platform-wide.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Price Per Student Per Month (UGX)
                        </label>
                        <input
                            type="number"
                            min={MIN_PRICE}
                            step={100}
                            value={draftPrice}
                            onChange={e => {
                                const value = e.target.value
                                if (value === '') {
                                    setDraftPrice('')
                                    return
                                }
                                const num = Number(value)
                                if (!isNaN(num) && num >= 0) {
                                    setDraftPrice(num)
                                }
                            }}
                            onBlur={() => {
                                if (draftPrice === '' || draftPrice < 0) {
                                    setDraftPrice(0)
                                }
                            }}
                            className="input-field text-lg font-bold"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Enter any price per student per month (0 and above)</p>
                    </div>

                    <div>
                        <input
                            type="range"
                            min={0}
                            max={10000}
                            step={100}
                            value={draftPrice}
                            onChange={e => setDraftPrice(Number(e.target.value))}
                            className="w-full accent-blue-600 dark:accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1">
                            <span>UGX 0</span>
                            <span>UGX 10,000</span>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Revenue Preview at UGX {fmt(draftPrice)}/student</p>
                        {[
                            { label: 'School with 300 students', students: 300 },
                            { label: 'School with 700 students', students: 700 },
                            { label: 'School with 1,500 students', students: 1500 },
                            { label: `Platform total (${fmt(summary.totalActiveStudents)} students)`, students: summary.totalActiveStudents },
                        ].map(row => (
                            <div key={row.label} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-slate-400">{row.label}</span>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                    UGX {fmt(row.students * (draftPrice || summary.pricePerStudent))}/mo
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* ── Payment Reminder Modal ── */}
            <Modal isOpen={modal === 'reminder'} onClose={() => setModal(null)} title="Send Payment Reminder"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={sendReminder}><Bell size={14} /> {actionLoading ? 'Sending…' : 'Send'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    {reminderSchool && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-sm">
                            <p className="font-semibold text-gray-800 dark:text-white">{reminderSchool.schoolName}</p>
                            <p className="text-gray-500 dark:text-slate-400">{fmt(reminderSchool.students)} students · UGX {fmt(reminderSchool.amount)} due</p>
                        </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-slate-400">A reminder email will be sent to the school's registered contact address.</p>
                </div>
            </Modal>

            {/* ── Pesapal Payment Link Modal ── */}
            <Modal isOpen={modal === 'payment'} onClose={() => setModal(null)} title="Pesapal Payment Link"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    {paymentSchool && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-sm">
                            <p className="font-semibold text-gray-800 dark:text-white">{paymentSchool.schoolName}</p>
                            <p className="text-gray-500 dark:text-slate-400">{fmt(paymentSchool.students)} students · UGX {fmt(paymentSchool.amount)} due</p>
                        </div>
                    )}
                    {actionLoading && <p className="text-sm text-gray-400">Generating a real Pesapal order…</p>}
                    {!actionLoading && paymentLink && (
                        <>
                            <div className="flex items-center gap-2">
                                <input readOnly value={paymentLink.redirectUrl} className="input-field text-xs font-mono" />
                                <button onClick={copyLink} className="btn-secondary text-xs py-1.5 px-3 flex-shrink-0">
                                    {copied ? 'Copied' : <><Copy size={12} /></>}
                                </button>
                            </div>
                            <a href={paymentLink.redirectUrl} target="_blank" rel="noreferrer" className="btn-primary w-full justify-center">
                                <ExternalLink size={14} /> Open Payment Page
                            </a>
                            {paymentLink.reused && (
                                <p className="text-xs text-amber-600">Reused an existing in-progress payment link for this invoice.</p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-slate-500">Share this link with the school, or send it via the Remind action. It will mark the invoice paid automatically once completed — no manual step needed.</p>
                        </>
                    )}
                </div>
            </Modal>

            {/* ── Refund Modal ── */}
            <Modal isOpen={modal === 'refund'} onClose={() => setModal(null)} title="Request Refund"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading || !refundRemarks.trim()} className="btn-danger disabled:opacity-50" onClick={submitRefund}><RotateCcw size={14} /> {actionLoading ? 'Submitting…' : 'Submit Refund Request'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    {paymentSchool && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-sm">
                            <p className="font-semibold text-gray-800 dark:text-white">{paymentSchool.schoolName}</p>
                            <p className="text-gray-500 dark:text-slate-400">Paid: UGX {fmt(paymentSchool.amount)}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Refund Amount (UGX)</label>
                        <input type="number" className="input-field" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} max={paymentSchool?.amount} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason *</label>
                        <textarea className="input-field resize-none" rows={3} value={refundRemarks} onChange={e => setRefundRemarks(e.target.value)} placeholder="e.g. Duplicate payment" />
                    </div>
                    <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">Pesapal only allows one refund request per payment, and it requires manual finance-team approval on their end — this submits the request, it doesn't instantly refund.</p>
                </div>
            </Modal>
        </DashboardLayout>
    )
}