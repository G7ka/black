import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Edit2, Bell, AlertCircle, Check, Users, DollarSign, TrendingUp, School, Save, Info } from 'lucide-react'

// ── Pricing config (set by super admin) ──
const DEFAULT_PRICE_PER_STUDENT = 2000   // UGX per student per month
const MIN_PRICE = 2000
const MAX_PRICE = 4000

// ── School subscription data ──
const schools = [
    { id: 1, name: 'Greenhill Academy', students: 850, level: 'Secondary', status: 'active', joined: '2025-09', dueDate: '2026-03-15' },
    { id: 2, name: 'Aga Khan School', students: 620, level: 'Primary', status: 'active', joined: '2025-10', dueDate: '2026-03-15' },
    { id: 3, name: "St. Mary's College", students: 1100, level: 'Secondary', status: 'overdue', joined: '2025-08', dueDate: '2026-02-15' },
    { id: 4, name: 'Nile International', students: 430, level: 'Primary', status: 'active', joined: '2025-11', dueDate: '2026-03-15' },
    { id: 5, name: 'Buganda Road PS', students: 980, level: 'Primary', status: 'overdue', joined: '2025-07', dueDate: '2026-02-28' },
    { id: 6, name: 'Kabale Primary', students: 310, level: 'Primary', status: 'pending', joined: '2025-12', dueDate: '2026-03-28' },
    { id: 7, name: 'Makerere College', students: 1540, level: 'Secondary', status: 'active', joined: '2025-09', dueDate: '2026-03-15' },
]

function fmt(n) {
    return n.toLocaleString('en-UG')
}

export default function SASubscriptions() {
    const [modal, setModal] = useState(null)
    const [tab, setTab] = useState('schools')
    const [pricePerStudent, setPricePerStudent] = useState(DEFAULT_PRICE_PER_STUDENT)
    const [draftPrice, setDraftPrice] = useState(DEFAULT_PRICE_PER_STUDENT)
    const [reminderSchool, setReminderSchool] = useState(null)

    const totalStudents = schools.filter(s => s.status === 'active').reduce((a, b) => a + b.students, 0)
    const monthlyRevenue = schools.filter(s => s.status === 'active').reduce((a, b) => a + b.students * pricePerStudent, 0)
    const overdueCount = schools.filter(s => s.status === 'overdue').length

    const openReminder = (school) => { setReminderSchool(school); setModal('reminder') }

    const savePricing = () => {
        const v = Math.min(MAX_PRICE, Math.max(MIN_PRICE, Math.round(draftPrice / 500) * 500))
        setPricePerStudent(v)
        setDraftPrice(v)
        setModal(null)
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title">Subscriptions & Billing</h1>
                        <p className="page-subtitle">Per-student monthly billing — UGX {fmt(pricePerStudent)} per student</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setDraftPrice(pricePerStudent); setModal('pricing') }}>
                        <Edit2 size={15} /> Set Price Per Student
                    </button>
                </div>

                {/* Summary cards */}
                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1"><Users size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Active Students</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{fmt(totalStudents)}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">across {schools.filter(s => s.status === 'active').length} schools</p>
                    </div>
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1"><DollarSign size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Monthly Revenue</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">UGX {fmt(monthlyRevenue)}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">@ {fmt(pricePerStudent)}/student</p>
                    </div>
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1"><School size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Total Schools</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{schools.length}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{schools.filter(s => s.status === 'pending').length} pending approval</p>
                    </div>
                    <div className="stat-card flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1"><AlertCircle size={16} /><span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Overdue</span></div>
                        <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{overdueCount}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">schools with unpaid bills</p>
                    </div>
                </div>

                {/* Schools table */}
                <div className="card p-0">
                    <div className="flex border-b border-gray-100 dark:border-slate-700 flex-wrap">
                        {['schools', 'overdue'].map(t => (
                            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}>
                                {t}{t === 'overdue' && overdueCount > 0 && <span className="ml-1 badge bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs">{overdueCount}</span>}
                            </button>
                        ))}
                    </div>

                    {tab === 'schools' && (
                        <div className="overflow-x-auto">
                            <div className="overflow-x-auto"><table className="w-full min-w-[640px]">
                                <thead><tr>
                                    {['School', 'Level', 'Students', 'Monthly Bill (UGX)', 'Due Date', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}
                                </tr></thead>
                                <tbody>
                                    {schools.map(s => {
                                        const bill = s.students * pricePerStudent
                                        return (
                                            <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                                <td className="table-cell font-semibold dark:text-white">{s.name}</td>
                                                <td className="table-cell text-gray-500 dark:text-slate-400">{s.level}</td>
                                                <td className="table-cell">
                                                    <span className="flex items-center gap-1 dark:text-slate-300"><Users size={13} className="text-gray-400 dark:text-slate-500" />{fmt(s.students)}</span>
                                                </td>
                                                <td className="table-cell font-semibold text-blue-700 dark:text-blue-400">{fmt(bill)}</td>
                                                <td className="table-cell text-gray-500 dark:text-slate-400 text-xs">{s.dueDate}</td>
                                                <td className="table-cell"><Badge variant={s.status === 'active' ? 'success' : s.status === 'overdue' ? 'danger' : 'warning'}>{s.status}</Badge></td>
                                                <td className="table-cell">
                                                    <div className="flex gap-1 flex-wrap">
                                                        <button className="btn-secondary text-xs py-1 px-2">View</button>
                                                        {s.status !== 'active' && (
                                                            <button className="btn-primary text-xs py-1 px-2" onClick={() => openReminder(s)}>
                                                                <Bell size={11} /> Remind
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="table-cell font-bold text-gray-800 dark:text-slate-200" colSpan={3}>Total (active schools)</td>
                                        <td className="table-cell font-extrabold text-blue-700 dark:text-blue-400">{fmt(monthlyRevenue)}</td>
                                        <td className="table-cell" colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table></div>
                        </div>
                    )}

                    {tab === 'overdue' && (
                        <div className="p-6 space-y-3">
                            {schools.filter(s => s.status === 'overdue').map(s => {
                                const bill = s.students * pricePerStudent
                                return (
                                    <div key={s.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 flex-wrap gap-3">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle size={18} className="text-red-500 dark:text-red-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold dark:text-white">{s.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">Due: {s.dueDate} · {fmt(s.students)} students · UGX {fmt(bill)}/mo</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn-secondary text-xs py-1 px-3" onClick={() => openReminder(s)}><Bell size={11} /> Remind</button>
                                            <button className="btn-danger text-xs py-1 px-3">Suspend</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Set Price Per Student Modal ── */}
            <Modal isOpen={modal === 'pricing'} onClose={() => setModal(null)} title="Set Price Per Student"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={savePricing}><Save size={14} /> Save Pricing</button></>}>
                <div className="space-y-5">
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
                            max={MAX_PRICE}
                            step={500}
                            value={draftPrice}
                            onChange={e => setDraftPrice(Number(e.target.value))}
                            className="input-field text-lg font-bold"
                        />
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Allowed range: UGX {fmt(MIN_PRICE)} – {fmt(MAX_PRICE)} per student/month</p>
                    </div>

                    {/* Range slider */}
                    <div>
                        <input
                            type="range"
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            step={500}
                            value={draftPrice}
                            onChange={e => setDraftPrice(Number(e.target.value))}
                            className="w-full accent-blue-600 dark:accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 dark:text-slate-500 mt-1">
                            <span>UGX {fmt(MIN_PRICE)}</span>
                            <span>UGX {fmt(MAX_PRICE)}</span>
                        </div>
                    </div>

                    {/* Live preview */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Revenue Preview at UGX {fmt(draftPrice)}/student</p>
                        {[
                            { label: 'School with 300 students', students: 300 },
                            { label: 'School with 700 students', students: 700 },
                            { label: 'School with 1,500 students', students: 1500 },
                            { label: `Platform total (${fmt(totalStudents)} students)`, students: totalStudents },
                        ].map(row => (
                            <div key={row.label} className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-slate-400">{row.label}</span>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">UGX {fmt(row.students * draftPrice)}/mo</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* ── Payment Reminder Modal ── */}
            <Modal isOpen={modal === 'reminder'} onClose={() => setModal(null)} title="Send Payment Reminder"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><Bell size={14} /> Send</button></>}>
                <div className="space-y-4">
                    {reminderSchool && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-sm">
                            <p className="font-semibold text-gray-800 dark:text-white">{reminderSchool.name}</p>
                            <p className="text-gray-500 dark:text-slate-400">{fmt(reminderSchool.students)} students · UGX {fmt(reminderSchool.students * pricePerStudent)} due</p>
                        </div>
                    )}
                    <div className="flex gap-4 flex-wrap">{['Email', 'SMS', 'In-app'].map(ch => <label key={ch} className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-slate-300"><input type="checkbox" defaultChecked /><span className="text-sm">{ch}</span></label>)}</div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message</label>
                        <textarea className="input-field resize-none" rows={3} defaultValue={`Dear Admin, your monthly invoice of UGX ${reminderSchool ? fmt(reminderSchool.students * pricePerStudent) : ''} is overdue. Please process payment to avoid service suspension.`} /></div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
