import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, CheckCircle2, AlertCircle } from 'lucide-react'
import { teachersApi } from '../../api/teachers.api'
import { classesApi } from '../../api/classes.api'

const leaveReasons = ['Leave', 'Field Trip', 'Sick Leave', 'Conference', 'Personal', 'Maternity/Paternity', 'Other']

export default function SchoolAdminTeachers({ role = "schooladmin-primary" }) {
    const [view, setView] = useState('staff')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [successMsg, setSuccessMsg] = useState('')

    const [teachers, setTeachers] = useState([])
    const [absenceReports, setAbsenceReports] = useState([])
    const [classes, setClasses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [leaveReason, setLeaveReason] = useState('')
    const [leaveStart, setLeaveStart] = useState('')
    const [leaveEnd, setLeaveEnd] = useState('')
    const [leaveNotes, setLeaveNotes] = useState('')

    const [relocateSubjectId, setRelocateSubjectId] = useState('')
    const [relocateClassIds, setRelocateClassIds] = useState([])

    const [addForm, setAddForm] = useState({ fullName: '', email: '', phone: '', subjectSpecialization: '' })

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            const [teachersResult, reportsResult, classesResult, subjectsResult] = await Promise.all([
                teachersApi.list(statusFilter === 'All' ? undefined : statusFilter === 'Active' ? 'ACTIVE' : 'ON_LEAVE'),
                teachersApi.listAbsenceReports(),
                classesApi.list(),
                classesApi.listSubjects(),
            ])
            setTeachers(teachersResult)
            setAbsenceReports(reportsResult)
            setClasses(classesResult)
            setSubjects(subjectsResult)
        } catch (err) {
            setLoadError(err.message || 'Failed to load teachers')
        } finally {
            setLoading(false)
        }
    }, [statusFilter])

    useEffect(() => { load() }, [load])

    const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3500) }

    const filteredTeachers = teachers.filter(t =>
        t.fullName.toLowerCase().includes(search.toLowerCase()) || (t.subjectSpecialization || '').toLowerCase().includes(search.toLowerCase())
    )

    const openLeaveModal = (t) => {
        setSelected(t); setLeaveReason('Leave'); setLeaveStart(''); setLeaveEnd(''); setLeaveNotes(''); setModal('leave'); setActionError('')
    }

    const saveLeave = async () => {
        setActionLoading(true); setActionError('')
        try {
            await teachersApi.setOnLeave(selected.id, { leaveReason, leaveStart: leaveStart || undefined, leaveEnd: leaveEnd || undefined, leaveNotes: leaveNotes || undefined })
            setModal(null); flash(`${selected.fullName} marked as on leave.`); await load()
        } catch (err) { setActionError(err.message || 'Failed to update leave status') } finally { setActionLoading(false) }
    }

    const markActive = async (t) => {
        setActionError('')
        try { await teachersApi.setActive(t.id); flash(`${t.fullName} is now active.`); await load() }
        catch (err) { setActionError(err.message || 'Failed to activate teacher') }
    }

    const markInactive = async (t) => {
        setActionError('')
        try { await teachersApi.setInactive(t.id); flash(`${t.fullName} marked as inactive.`); await load() }
        catch (err) { setActionError(err.message || 'Failed to deactivate teacher') }
    }

    const openRelocate = (t) => {
        setSelected(t)
        setRelocateSubjectId(t.classAssignments?.[0]?.subjectId || '')
        setRelocateClassIds(t.classAssignments?.map(a => a.classId) || [])
        setModal('relocate'); setActionError('')
    }

    const toggleClassSelection = (classId) => {
        setRelocateClassIds(prev => prev.includes(classId) ? prev.filter(c => c !== classId) : [...prev, classId])
    }

    const saveRelocate = async () => {
        setActionLoading(true); setActionError('')
        try {
            const assignments = relocateClassIds.map(classId => ({ classId, subjectId: relocateSubjectId || undefined }))
            await teachersApi.assignClasses(selected.id, assignments)
            setModal(null); flash('Class assignments updated.'); await load()
        } catch (err) { setActionError(err.message || 'Failed to update assignments') } finally { setActionLoading(false) }
    }

    const submitAddTeacher = async () => {
        setActionLoading(true); setActionError('')
        try {
            await teachersApi.create(addForm)
            setModal(null); setAddForm({ fullName: '', email: '', phone: '', subjectSpecialization: '' })
            flash('Teacher added — a set-password code was emailed to them.')
            await load()
        } catch (err) { setActionError(err.message || 'Failed to add teacher') } finally { setActionLoading(false) }
    }

    const reviewReport = async (id) => {
        setActionError('')
        try { await teachersApi.reviewAbsenceReport(id); await load() }
        catch (err) { setActionError(err.message || 'Failed to update report') }
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6 relative">
                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">{view === 'staff' ? 'Teachers' : 'Absence Reports'}</h1>
                        <p className="page-subtitle">{view === 'staff' ? 'Manage all teaching staff' : 'Student-submitted teacher absence reports'}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'staff' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`} onClick={() => setView('staff')}>Staff</button>
                        <button className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'reports' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`} onClick={() => setView('reports')}>Absence Reports {absenceReports.filter(r => r.status === 'PENDING').length > 0 && <span className="ml-1 text-xs">({absenceReports.filter(r => r.status === 'PENDING').length})</span>}</button>
                        {view === 'staff' && <button className="btn-primary" onClick={() => { setModal('add'); setActionError('') }}><Plus size={15} /> Add Teacher</button>}
                    </div>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                {view === 'staff' && (
                    <>
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search teachers..." />
                            </div>
                            <div className="flex items-center gap-2">
                                {['All', 'Active', 'On Leave'].map(f => (
                                    <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f}</button>
                                ))}
                            </div>
                        </div>

                        <div className="card p-0">
                            <div className="overflow-x-auto"><table className="w-full">
                                <thead><tr>{['Teacher', 'Subject', 'Phone', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                                <tbody>
                                    {loading && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">Loading…</td></tr>}
                                    {!loading && filteredTeachers.map(t => (
                                        <tr key={t.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                            <td className="table-cell">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{t.fullName.split(' ').pop()[0]}</div>
                                                    <p className="text-sm font-semibold dark:text-white">{t.fullName}</p>
                                                </div>
                                            </td>
                                            <td className="table-cell text-sm dark:text-slate-300">{t.subjectSpecialization || '—'}</td>
                                            <td className="table-cell text-xs text-gray-500 dark:text-slate-400">{t.email}</td>
                                            <td className="table-cell"><Badge variant={t.status === 'ACTIVE' ? 'success' : t.status === 'ON_LEAVE' ? 'warning' : 'gray'}>{t.status === 'ON_LEAVE' ? 'On Leave' : t.status.toLowerCase()}</Badge></td>
                                            <td className="table-cell">
                                                <div className="flex gap-1 flex-wrap">
                                                    <button onClick={() => { setSelected(t); setModal('view') }} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" title="View"><Eye size={14} /></button>
                                                    <button onClick={() => openRelocate(t)} className="btn-secondary py-1 px-2 text-xs">Assign Classes</button>
                                                    {t.status === 'ACTIVE' ? (
                                                        <button onClick={() => openLeaveModal(t)} className="py-1 px-2 text-xs rounded-lg border border-amber-200 bg-amber-50 text-amber-700 font-semibold">Leave</button>
                                                    ) : (
                                                        <button onClick={() => markActive(t)} className="py-1 px-2 text-xs rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold">Activate</button>
                                                    )}
                                                    {t.status !== 'INACTIVE' && <button onClick={() => markInactive(t)} className="py-1 px-2 text-xs rounded-lg border border-red-200 bg-red-50 text-red-700 font-semibold">Deactivate</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table></div>
                        </div>
                    </>
                )}

                {view === 'reports' && (
                    <div className="card p-0">
                        <div className="overflow-x-auto"><table className="w-full">
                            <thead><tr>{['Date', 'Teacher', 'Reason', 'Status', 'Action'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {absenceReports.map(r => (
                                    <tr key={r.id} className="hover:bg-blue-50/30">
                                        <td className="table-cell text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="table-cell text-sm font-medium">{r.teacherProfile?.user?.fullName}</td>
                                        <td className="table-cell text-sm text-gray-600">{r.reason}</td>
                                        <td className="table-cell"><Badge variant={r.status === 'PENDING' ? 'warning' : 'success'}>{r.status.toLowerCase()}</Badge></td>
                                        <td className="table-cell">{r.status === 'PENDING' && <button onClick={() => reviewReport(r.id)} className="btn-secondary text-xs py-1 px-2">Mark Reviewed</button>}</td>
                                    </tr>
                                ))}
                                {absenceReports.length === 0 && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">No absence reports yet.</td></tr>}
                            </tbody>
                        </table></div>
                    </div>
                )}
            </div>

            <Modal isOpen={modal === 'leave'} onClose={() => setModal(null)} title={`Set Leave: ${selected?.fullName}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveLeave}>{actionLoading ? 'Saving…' : 'Confirm'}</button></>}>
                {selected && (
                    <div className="space-y-4">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <select className="select-field" value={leaveReason} onChange={e => setLeaveReason(e.target.value)}>
                                {leaveReasons.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" className="input-field" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Expected Return</label><input type="date" className="input-field" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} /></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label><textarea className="input-field resize-none" rows={2} value={leaveNotes} onChange={e => setLeaveNotes(e.target.value)} /></div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'relocate'} onClose={() => setModal(null)} title={`Assign Classes: ${selected?.fullName}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveRelocate}>{actionLoading ? 'Saving…' : 'Save Changes'}</button></>}>
                {selected && (
                    <div className="space-y-5">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Main Subject</label>
                            <select className="input-field w-full" value={relocateSubjectId} onChange={e => setRelocateSubjectId(e.target.value)}>
                                <option value="">Select subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Classes</label>
                            <div className="flex flex-wrap gap-2">
                                {classes.map(c => (
                                    <button key={c.id} onClick={() => toggleClassSelection(c.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${relocateClassIds.includes(c.id) ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'add'} onClose={() => setModal(null)} title="Add New Teacher" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={submitAddTeacher}><Plus size={14} /> {actionLoading ? 'Adding…' : 'Add Teacher'}</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    {actionError && <p className="col-span-2 text-sm text-red-600">{actionError}</p>}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input className="input-field" placeholder="Mr. John Doe" value={addForm.fullName} onChange={e => setAddForm(f => ({ ...f, fullName: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input-field" placeholder="j.doe@school.ug" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" className="input-field" placeholder="+256 700 000000" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Main Subject</label>
                        <select className="select-field" value={addForm.subjectSpecialization} onChange={e => setAddForm(f => ({ ...f, subjectSpecialization: e.target.value }))}>
                            <option value="">Select subject</option>
                            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">A set-password code will be emailed automatically — no password is created here.</div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title="Teacher Details"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">{selected.fullName.split(' ').pop()[0]}</div>
                            <div><p className="text-lg font-bold dark:text-white">{selected.fullName}</p><p className="text-sm text-gray-500 dark:text-slate-400">{selected.email}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[['Subject', selected.subjectSpecialization || '—'], ['Status', selected.status === 'ON_LEAVE' ? 'On Leave' : selected.status]].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-xl"><p className="text-xs text-gray-500 dark:text-slate-400">{k}</p><p className="font-semibold mt-0.5 dark:text-white">{v}</p></div>
                            ))}
                        </div>
                        {selected.status === 'ON_LEAVE' && selected.leaveReason && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">Leave Details</p>
                                <p className="text-sm text-amber-800"><strong>Reason:</strong> {selected.leaveReason}</p>
                                {selected.leaveStart && <p className="text-sm text-amber-800"><strong>Period:</strong> {new Date(selected.leaveStart).toLocaleDateString()} → {selected.leaveEnd ? new Date(selected.leaveEnd).toLocaleDateString() : 'TBD'}</p>}
                                {selected.leaveNotes && <p className="text-sm text-amber-800 mt-1">{selected.leaveNotes}</p>}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
