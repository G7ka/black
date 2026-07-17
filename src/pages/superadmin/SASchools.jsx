import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, CheckCircle, XCircle, Pause, Trash2, LogIn, FileText, Upload, Edit3, DollarSign, AlertCircle } from 'lucide-react'
import { schoolsAdminApi } from '../../api/schoolsAdmin.api'
import { billingApi } from '../../api/billing.api'

const statusVariant = { ACTIVE: 'success', active: 'success', PENDING: 'warning', pending: 'warning', SUSPENDED: 'danger', suspended: 'danger', REJECTED: 'gray', rejected: 'gray' }
const levelVariant = { PRIMARY: 'sky', Primary: 'sky', SECONDARY: 'indigo', Secondary: 'indigo' }

const emptyAddForm = {
    schoolName: '', level: 'Primary', district: '', physicalAddress: '',
    numStudents: '', contactName: '', contactPhone: '', contactEmail: '', subdomain: '',
}

export default function SASchools() {
    const [schools, setSchools] = useState([])
    const [billingBySchool, setBillingBySchool] = useState({})
    const [loading, setLoading] = useState(true)
    const [listError, setListError] = useState('')

    const [filter, setFilter] = useState('all')
    const [levelFilter, setLevelFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [addForm, setAddForm] = useState(emptyAddForm)
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const loadSchools = useCallback(async () => {
        setLoading(true)
        setListError('')
        try {
            const result = await schoolsAdminApi.list({
                status: filter,
                level: levelFilter === 'all' ? 'all' : levelFilter,
                search: search || undefined,
                page: 1,
                pageSize: 100,
            })
            setSchools(result.schools)

            // Billing (bill amount / payment status) only exists for ACTIVE
            // schools — merge it in for the table's Monthly Bill/Payment columns.
            const billing = await billingApi.list()
            const map = {}
            billing.schools.forEach((b) => { map[b.schoolId] = b })
            setBillingBySchool(map)
        } catch (err) {
            setListError(err.message || 'Failed to load schools')
        } finally {
            setLoading(false)
        }
    }, [filter, levelFilter, search])

    useEffect(() => { loadSchools() }, [loadSchools])

    const openModal = (type, school) => { setModal(type); setSelected(school); setActionError('') }
    const closeModal = () => { setModal(null); setSelected(null); setRejectReason(''); setAddForm(emptyAddForm); setActionError('') }

    const runAction = async (fn, successModal = null) => {
        setActionLoading(true)
        setActionError('')
        try {
            await fn()
            await loadSchools()
            closeModal()
        } catch (err) {
            setActionError(err.message || 'Action failed')
        } finally {
            setActionLoading(false)
        }
    }

    const counts = { active: 0, pending: 0, suspended: 0 }
    schools.forEach((s) => { const k = s.status.toLowerCase(); if (counts[k] !== undefined) counts[k]++ })

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Schools Management</h1>
                        <p className="page-subtitle">Manage all registered schools on the platform</p>
                    </div>
                    <button className="btn-primary" onClick={() => setModal('add')}>
                        <Plus size={16} /> Add School
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 w-full">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                        {['all', 'active', 'pending', 'suspended'].map(t => (
                            <button key={t} onClick={() => setFilter(t)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                                {t} {t !== 'all' && <span className="ml-1 text-xs opacity-70">({counts[t] || 0})</span>}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-1 hidden sm:block"></div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                        {['all', 'Primary', 'Secondary'].map(l => (
                            <button key={l} onClick={() => setLevelFilter(l)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${levelFilter === l ? 'bg-slate-700 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                                {l === 'all' ? 'All Levels' : l}
                            </button>
                        ))}
                    </div>
                    <div className="sm:ml-auto relative w-full sm:w-auto mt-2 sm:mt-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools..." className="input-field pl-9 w-full sm:w-64" />
                    </div>
                </div>

                {listError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {listError}
                    </div>
                )}

                {/* Table */}
                <div className="card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['School Name', 'Level', 'Location', 'Students', 'Monthly Bill', 'Contact', 'Subdomain', 'Status', 'Payment', 'Actions'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan={10} className="table-cell text-center text-gray-400 py-8">Loading schools…</td></tr>
                                )}
                                {!loading && schools.map(s => {
                                    const bill = billingBySchool[s.id]
                                    return (
                                    <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="table-cell font-semibold text-gray-900 dark:text-white">{s.name}</td>
                                        <td className="table-cell"><Badge variant={levelVariant[s.level]}>{s.level}</Badge></td>
                                        <td className="table-cell text-gray-500 dark:text-slate-400">{s.district}</td>
                                        <td className="table-cell">{s.numStudentsDeclared.toLocaleString()}</td>
                                        <td className="table-cell font-semibold text-blue-700 dark:text-blue-400">{bill ? `UGX ${bill.amount.toLocaleString()}` : '—'}</td>
                                        <td className="table-cell text-xs text-gray-500 dark:text-slate-400">{s.contactName}</td>
                                        <td className="table-cell">
                                            <code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-blue-700 dark:text-blue-400">{s.subdomain}.edumanage.ug</code>
                                        </td>
                                        <td className="table-cell">
                                            <Badge variant={statusVariant[s.status]}>{s.status.toLowerCase()}</Badge>
                                        </td>
                                        <td className="table-cell">
                                            {bill ? <Badge variant={bill.status === 'PAID' ? 'success' : bill.status === 'OVERDUE' ? 'danger' : 'warning'}>{bill.status.toLowerCase()}</Badge> : '—'}
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openModal('view', s)} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="View">
                                                    <Eye size={14} />
                                                </button>
                                                {s.status === 'PENDING' && (
                                                    <>
                                                        <button onClick={() => openModal('approve', s)} className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600" title="Approve">
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button onClick={() => openModal('reject', s)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600" title="Reject">
                                                            <XCircle size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {s.status === 'ACTIVE' && (
                                                    <button onClick={() => openModal('suspend', s)} className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600" title="Suspend">
                                                        <Pause size={14} />
                                                    </button>
                                                )}
                                                {s.status === 'ACTIVE' && (
                                                    <button onClick={() => runAction(() => schoolsAdminApi.impersonate(s.id).then((r) => {
                                                        // Impersonation opens the school's portal in a new tab with a
                                                        // one-time-use tenant access token appended for handoff.
                                                        window.open(`https://${s.subdomain}.edumanage.ug/?impersonation_token=${r.accessToken}`, '_blank')
                                                    }))} className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-600" title="Login as Admin">
                                                        <LogIn size={14} />
                                                    </button>
                                                )}
                                                <button onClick={() => openModal('delete', s)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                    {!loading && schools.length === 0 && (
                        <div className="py-12 text-center text-gray-400 dark:text-slate-500">No schools found matching the criteria.</div>
                    )}
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl">
                        <p className="text-xs text-gray-500 dark:text-slate-400">Showing {schools.length} school(s)</p>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <Modal isOpen={modal === 'approve'} onClose={closeModal} title="Approve School Application"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button disabled={actionLoading} className="btn-success" onClick={() => runAction(() => schoolsAdminApi.approve(selected.id))}><CheckCircle size={14} /> {actionLoading ? 'Approving…' : 'Approve School'}</button></>}
            >
                <div className="space-y-3">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{selected?.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{selected?.district} · {selected?.subdomain}.edumanage.ug</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300">Approving this school will:
                        <ul className="list-disc ml-5 mt-1 space-y-1 text-xs text-gray-500 dark:text-slate-400">
                            <li>Activate their account & subdomain</li>
                            <li>Send welcome email with login credentials</li>
                            <li>Start their subscription billing cycle</li>
                        </ul>
                    </p>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal isOpen={modal === 'reject'} onClose={closeModal} title="Reject Application"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button disabled={actionLoading || !rejectReason.trim()} className="btn-danger disabled:opacity-50" onClick={() => runAction(() => schoolsAdminApi.reject(selected.id, rejectReason))}><XCircle size={14} /> {actionLoading ? 'Rejecting…' : 'Reject'}</button></>}
            >
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">{selected?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason for Rejection *</label>
                        <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} className="input-field resize-none"
                            placeholder="Provide a reason that will be emailed to the applicant..." />
                    </div>
                </div>
            </Modal>

            {/* Suspend Modal */}
            <Modal isOpen={modal === 'suspend'} onClose={closeModal} title="Suspend School"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button disabled={actionLoading} className="btn-danger" onClick={() => runAction(() => schoolsAdminApi.suspend(selected.id, rejectReason || undefined))}><Pause size={14} /> {actionLoading ? 'Suspending…' : 'Suspend School'}</button></>}
            >
                {actionError && <p className="text-sm text-red-600 mb-2">{actionError}</p>}
                <p className="text-sm text-gray-600 dark:text-slate-300">Are you sure you want to suspend <strong>{selected?.name}</strong>? Their students and teachers will lose access immediately.</p>
            </Modal>

            {/* Login-as Modal (impersonation now happens directly via table action; this stays as a fallback confirmation for the flow described in the UI) */}
            <Modal isOpen={modal === 'login'} onClose={closeModal} title="Login as School Admin"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-primary" onClick={() => runAction(() => schoolsAdminApi.impersonate(selected.id).then((r) => window.open(`https://${selected.subdomain}.edumanage.ug/?impersonation_token=${r.accessToken}`, '_blank')))}><LogIn size={14} /> Enter School Portal</button></>}
            >
                {actionError && <p className="text-sm text-red-600 mb-2">{actionError}</p>}
                <p className="text-sm text-gray-600 dark:text-slate-300">You are about to impersonate <strong>{selected?.name}</strong> as their School Admin. All actions will be logged for audit.</p>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete School"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button disabled={actionLoading} className="btn-danger" onClick={() => runAction(() => schoolsAdminApi.remove(selected.id))}><Trash2 size={14} /> {actionLoading ? 'Deleting…' : 'Permanently Delete'}</button></>}
            >
                <div className="space-y-3">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">⚠ This action is irreversible</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300">Deleting <strong>{selected?.name}</strong> will permanently remove all data including students, grades, attendance records, and payment history.</p>
                </div>
            </Modal>

            {/* View School Modal — real backend fields */}
            <Modal isOpen={modal === 'view'} onClose={closeModal} title="School Details" size="lg"
                footer={<button className="btn-secondary" onClick={closeModal}>Close</button>}
            >
                {selected && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {[
                                ['School Name', selected.name], ['Level', selected.level],
                                ['District', selected.district], ['Physical Address', selected.physicalAddress],
                                ['Number of Students', selected.numStudentsDeclared],
                                ['Subdomain', `${selected.subdomain}.edumanage.ug`],
                                ['Status', selected.status.toLowerCase()],
                                ['Registered', new Date(selected.createdAt).toLocaleDateString()],
                            ].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{k}</p>
                                    <p className="text-gray-900 dark:text-white font-semibold mt-0.5 capitalize">{v}</p>
                                </div>
                            ))}
                        </div>

                        {billingBySchool[selected.id] && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">Billing Breakdown</h3>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Students</span><span className="font-semibold dark:text-white">{selected.numStudentsDeclared.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Rate per student</span><span className="font-semibold dark:text-white">UGX {billingBySchool[selected.id].amount / selected.numStudentsDeclared}/mo</span></div>
                                    <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2 mt-1"><span className="font-bold text-gray-800 dark:text-slate-200">Total Monthly Bill</span><span className="font-extrabold text-blue-700 dark:text-blue-400 text-base">UGX {billingBySchool[selected.id].amount.toLocaleString()}</span></div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">Contact Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                {[
                                    ['Contact Person', selected.contactName],
                                    ['Phone Number', selected.contactPhone],
                                    ['Email Address', selected.contactEmail],
                                ].map(([k, v]) => (
                                    <div key={k} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                        <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">{k}</p>
                                        <p className="text-gray-900 dark:text-white font-semibold mt-0.5">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add School Modal — platform-created, auto-provisions admin credentials via email */}
            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Register New School" size="lg"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={() => runAction(() => schoolsAdminApi.create(addForm))}><Plus size={14} /> {actionLoading ? 'Creating…' : 'Register School'}</button></>}
            >
                <div className="space-y-5">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3">School Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">School Name *</label>
                                <input type="text" placeholder="e.g., Greenhill Academy" className="input-field" value={addForm.schoolName} onChange={e => setAddForm(f => ({ ...f, schoolName: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">School Level *</label>
                                <select className="select-field" value={addForm.level} onChange={e => setAddForm(f => ({ ...f, level: e.target.value }))}>
                                    <option value="Primary">Primary</option>
                                    <option value="Secondary">Secondary</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">District *</label>
                                <input type="text" placeholder="e.g., Kampala" className="input-field" value={addForm.district} onChange={e => setAddForm(f => ({ ...f, district: e.target.value }))} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Physical Address *</label>
                                <input type="text" placeholder="e.g., Plot 12, Makerere Hill Rd" className="input-field" value={addForm.physicalAddress} onChange={e => setAddForm(f => ({ ...f, physicalAddress: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Number of Students</label>
                                <input type="number" placeholder="e.g., 500" className="input-field" value={addForm.numStudents} onChange={e => setAddForm(f => ({ ...f, numStudents: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contact Person *</label>
                                <input type="text" placeholder="Full name" className="input-field" value={addForm.contactName} onChange={e => setAddForm(f => ({ ...f, contactName: e.target.value }))} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone Number *</label>
                                <input type="tel" placeholder="+256 700 000000" className="input-field" value={addForm.contactPhone} onChange={e => setAddForm(f => ({ ...f, contactPhone: e.target.value }))} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email Address *</label>
                                <input type="email" placeholder="admin@school.ug" className="input-field" value={addForm.contactEmail} onChange={e => setAddForm(f => ({ ...f, contactEmail: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3">Portal</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subdomain *</label>
                                <input type="text" placeholder="greenhill" className="input-field" value={addForm.subdomain} onChange={e => setAddForm(f => ({ ...f, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} />
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Will be: subdomain.edumanage.ug</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Billing</label>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-600 dark:text-slate-400">Est. Monthly Bill:</span>
                                        <span className="font-bold text-blue-700 dark:text-blue-400 text-base">
                                            UGX {addForm.numStudents ? (Number(addForm.numStudents) * 2000).toLocaleString() : '0'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-slate-400">Actual bill uses the current platform-wide price/student.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">
                            The school is activated immediately. The admin receives a 6-digit code by email to set their own password — no password is created or emailed by this form.
                        </p>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
