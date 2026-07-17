import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Upload, Zap, MoveRight, AlertCircle } from 'lucide-react'
import { studentsApi } from '../../api/students.api'
import { classesApi } from '../../api/classes.api'

export default function SchoolAdminStudents({ role = "schooladmin-primary" }) {
    const [classFilter, setClassFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [relocateTarget, setRelocateTarget] = useState('')
    const [enrollForm, setEnrollForm] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '', parentName: '', parentPhone: '', parentEmail: '' })

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const [studentsResult, classesResult] = await Promise.all([
                studentsApi.list({ search: search || undefined }),
                classesApi.list(),
            ])
            setStudents(studentsResult)
            setClasses(classesResult)
        } catch (err) {
            setLoadError(err.message || 'Failed to load students')
        } finally {
            setLoading(false)
        }
    }, [search])

    useEffect(() => { load() }, [load])

    const filtered = students.filter(s => classFilter === 'All' || s.className === classFilter)

    const openRelocate = (s) => { setSelected(s); setRelocateTarget(''); setModal('relocate'); setActionError('') }

    const confirmRelocate = async () => {
        if (!relocateTarget) return
        setActionLoading(true); setActionError('')
        try {
            await studentsApi.relocate(selected.id, { targetClassId: relocateTarget })
            setModal(null); await load()
        } catch (err) { setActionError(err.message || 'Failed to relocate student') } finally { setActionLoading(false) }
    }

    const confirmPromote = async () => {
        setActionLoading(true); setActionError('')
        try {
            await studentsApi.promote(selected.id)
            setModal(null); await load()
        } catch (err) { setActionError(err.message || 'Failed to promote student') } finally { setActionLoading(false) }
    }

    const submitEnroll = async () => {
        setActionLoading(true); setActionError('')
        try {
            await studentsApi.enroll(enrollForm)
            setModal(null)
            setEnrollForm({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '', parentName: '', parentPhone: '', parentEmail: '' })
            await load()
        } catch (err) { setActionError(err.message || 'Failed to enroll student') } finally { setActionLoading(false) }
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Students</h1><p className="page-subtitle">Manage all enrolled students</p></div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('import')}><Upload size={15} /> Import</button>
                        <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2" onClick={() => setModal('autopromote')}><Zap size={15} /> Bulk Promote</button>
                        <button className="btn-primary" onClick={() => { setModal('enroll'); setActionError('') }}><Plus size={15} /> Enroll</button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setClassFilter('All')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${classFilter === 'All' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All</button>
                    {classes.map(c => (
                        <button key={c.id} onClick={() => setClassFilter(c.name)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${classFilter === c.name ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{c.name}</button>
                    ))}
                    <div className="ml-auto relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-60" placeholder="Search students..." /></div>
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}

                <div className="card p-0">
                    <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr>{['Student', 'ID', 'Class', 'Parent Contact', 'Status', 'Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {loading && <tr><td colSpan={6} className="table-cell text-center text-gray-400 py-8">Loading…</td></tr>}
                            {!loading && filtered.map(s => (
                                <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                    <td className="table-cell">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">{s.firstName[0]}</div>
                                            <div><p className="text-sm font-semibold dark:text-white">{s.fullName}</p></div>
                                        </div>
                                    </td>
                                    <td className="table-cell font-mono text-xs text-gray-500 dark:text-slate-400">{s.studentCode}</td>
                                    <td className="table-cell"><Badge variant="info">{s.className}{s.streamName ? ` ${s.streamName}` : ''}</Badge></td>
                                    <td className="table-cell text-xs text-gray-600 dark:text-slate-300">
                                        {s.parents[0] ? <><p>{s.parents[0].fullName}</p><p className="text-gray-400 dark:text-slate-500">{s.parents[0].phone}</p></> : <span className="italic text-gray-400">No parent linked</span>}
                                    </td>
                                    <td className="table-cell"><Badge variant={s.status === 'ACTIVE' ? 'success' : s.status === 'REPEATING' ? 'warning' : 'gray'}>{s.status.toLowerCase()}</Badge></td>
                                    <td className="table-cell">
                                        <div className="flex gap-2">
                                            <button onClick={() => openRelocate(s)} className="btn-secondary py-1 px-2 text-xs flex items-center gap-1"><MoveRight size={12} /> Relocate</button>
                                            <button onClick={() => { setSelected(s); setModal('promote'); setActionError('') }} className="btn-primary text-xs py-1 px-2 text-white bg-blue-600 hover:bg-blue-700">Promote</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table></div>
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl">
                        <p className="text-xs text-gray-500 dark:text-slate-400">{filtered.length} students</p>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal === 'relocate'} onClose={() => setModal(null)} title={`Relocate Student: ${selected?.fullName}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading || !relocateTarget} className="btn-primary" onClick={confirmRelocate}>{actionLoading ? 'Relocating…' : 'Confirm Relocation'}</button></>}>
                {selected && (
                    <div className="space-y-4">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <p className="text-sm text-gray-600 dark:text-slate-300">Move <strong>{selected.fullName}</strong> from <strong>{selected.className}</strong> to:</p>
                        <select className="select-field" value={relocateTarget} onChange={e => setRelocateTarget(e.target.value)}>
                            <option value="">Select class</option>
                            {classes.filter(c => c.id !== selected.classId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'promote'} onClose={() => setModal(null)} title={`Promote Student: ${selected?.fullName}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={confirmPromote}>{actionLoading ? 'Promoting…' : 'Confirm Promotion'}</button></>}>
                {selected && (
                    <div className="space-y-3">
                        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                        <p className="text-sm text-gray-600 dark:text-slate-300">Promote <strong>{selected.fullName}</strong> from <strong>{selected.className}</strong> to the next class in sequence. If this is the school's final class, the student will be marked Graduated instead.</p>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modal === 'autopromote'} onClose={() => setModal(null)} title="Bulk Promotion"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                    Score-based auto-promotion needs a Grades module to know real student scores, which doesn't exist yet — this won't fabricate a pass/fail decision without real data. Use "Promote" per-student for now, or ask to have Grades + real auto-promotion built as its own task.
                </div>
            </Modal>

            <Modal isOpen={modal === 'enroll'} onClose={() => setModal(null)} title="Enroll New Student" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={submitEnroll}>{actionLoading ? 'Enrolling…' : 'Enroll Student'}</button></>}>
                <div className="grid grid-cols-2 gap-4">
                    {actionError && <p className="col-span-2 text-sm text-red-600">{actionError}</p>}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input className="input-field" value={enrollForm.firstName} onChange={e => setEnrollForm(f => ({ ...f, firstName: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input className="input-field" value={enrollForm.lastName} onChange={e => setEnrollForm(f => ({ ...f, lastName: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" className="input-field" value={enrollForm.dateOfBirth} onChange={e => setEnrollForm(f => ({ ...f, dateOfBirth: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select className="select-field" value={enrollForm.gender} onChange={e => setEnrollForm(f => ({ ...f, gender: e.target.value }))}>
                            <option value="">Select gender</option><option value="MALE">Male</option><option value="FEMALE">Female</option>
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                        <select className="select-field" value={enrollForm.classId} onChange={e => setEnrollForm(f => ({ ...f, classId: e.target.value, streamId: '' }))}>
                            <option value="">Select class</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {classes.find(c => c.id === enrollForm.classId)?.streams.length > 0 && (
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                            <select className="select-field" value={enrollForm.streamId || ''} onChange={e => setEnrollForm(f => ({ ...f, streamId: e.target.value }))}>
                                <option value="">Select stream</option>
                                {classes.find(c => c.id === enrollForm.classId).streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label><input className="input-field" value={enrollForm.parentName} onChange={e => setEnrollForm(f => ({ ...f, parentName: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label><input type="tel" className="input-field" placeholder="+256 700 000000" value={enrollForm.parentPhone} onChange={e => setEnrollForm(f => ({ ...f, parentPhone: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label><input type="email" className="input-field" value={enrollForm.parentEmail} onChange={e => setEnrollForm(f => ({ ...f, parentEmail: e.target.value }))} /></div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'import'} onClose={() => setModal(null)} title="Import Students from Excel"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                    Bulk Excel/CSV import isn't wired up yet. Use "Enroll" for now, or ask to have this built as its own task.
                </div>
            </Modal>
        </DashboardLayout>
    )
}
