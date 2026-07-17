import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Layers, Library, Users, Trash2, Plus, CalendarDays, AlertCircle } from 'lucide-react'
import { classesApi } from '../../api/classes.api'

export default function SecondaryAdminClasses() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [newStreamName, setNewStreamName] = useState('')

    const [classes, setClasses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const load = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            const [classesResult, subjectsResult] = await Promise.all([classesApi.list(), classesApi.listSubjects()])
            setClasses(classesResult)
            setSubjects(subjectsResult)
            if (selectedClass) setSelectedClass(classesResult.find(c => c.id === selectedClass.id) || null)
        } catch (err) {
            setLoadError(err.message || 'Failed to load classes')
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => { load() }, [load])

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || (c.tier || '').toLowerCase().includes(search.toLowerCase())
    )

    const openSubjectModal = (cls) => {
        setSelectedClass(cls); setSelectedSubjects(cls.subjects.map(s => s.id)); setModal('subjects'); setActionError('')
    }

    const openStreamsModal = (cls) => {
        setSelectedClass(cls); setNewStreamName(''); setModal('streams'); setActionError('')
    }

    const toggleSubject = (subjectId) => {
        setSelectedSubjects(prev => prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId])
    }

    const saveSubjects = async () => {
        setActionLoading(true); setActionError('')
        try {
            await classesApi.setSubjects(selectedClass.id, selectedSubjects)
            await load(); setModal(null)
        } catch (err) { setActionError(err.message || 'Failed to save subjects') } finally { setActionLoading(false) }
    }

    const addStream = async () => {
        if (!newStreamName.trim() || !selectedClass) return
        setActionLoading(true); setActionError('')
        try {
            await classesApi.addStream(selectedClass.id, newStreamName.trim().toUpperCase())
            setNewStreamName('')
            const refreshed = await classesApi.list()
            setClasses(refreshed)
            setSelectedClass(refreshed.find(c => c.id === selectedClass.id))
        } catch (err) { setActionError(err.message || 'Failed to add stream') } finally { setActionLoading(false) }
    }

    const removeStream = async (streamId, streamName) => {
        if (!window.confirm(`Remove stream "${streamName}" from ${selectedClass.name}?`)) return
        setActionError('')
        try {
            await classesApi.removeStream(selectedClass.id, streamId)
            const refreshed = await classesApi.list()
            setClasses(refreshed)
            setSelectedClass(refreshed.find(c => c.id === selectedClass.id))
        } catch (err) { setActionError(err.message || 'Failed to remove stream') }
    }

    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Secondary Classes & Streams</h1>
                        <p className="page-subtitle">View classes, manage streams, and assign subjects</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search classes..." />
                </div>

                {loadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError}</div>}
                {loading && <p className="text-sm text-gray-400">Loading…</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && filteredClasses.map((cls) => (
                        <div key={cls.id} className="card p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cls.name}</h3>
                                    {cls.tier && <Badge variant={cls.tier.includes('A') ? 'info' : 'success'} className="mt-1">{cls.tier}</Badge>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Students</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.studentCount ?? 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Streams</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Layers size={12} className="text-gray-400 dark:text-slate-500" /> {cls.streams.length}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-2">Streams</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {cls.streams.map(stream => (
                                        <span key={stream.id} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md">{stream.name}</span>
                                    ))}
                                    {cls.streams.length === 0 && <span className="text-xs text-gray-400 italic">No streams yet</span>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-2">Subjects ({cls.subjects.length})</p>
                                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto custom-scrollbar pr-1">
                                    {cls.subjects.map(subject => (
                                        <span key={subject.id} className="px-2 py-1 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md">{subject.name}</span>
                                    ))}
                                    {cls.subjects.length === 0 && <span className="text-xs text-gray-400 italic">No subjects assigned</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => openStreamsModal(cls)} className="py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-2">
                                    <Layers size={14} /> Manage Streams
                                </button>
                                <button onClick={() => openSubjectModal(cls)} className="py-2 bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-2">
                                    <Library size={14} /> Manage Subjects
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && filteredClasses.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No classes yet — add classes from Configuration.</p>}
            </div>

            {/* Manage Streams Modal */}
            <Modal isOpen={modal === 'streams'} onClose={() => setModal(null)} title={`Streams — ${selectedClass?.name}`} size="lg"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                <div className="space-y-5">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <p className="text-sm text-gray-600 dark:text-slate-300">All streams under <strong className="dark:text-white">{selectedClass?.name}</strong>. Each stream has its own timetable and student list.</p>

                    <div className="space-y-2">
                        {selectedClass?.streams.map(stream => (
                            <div key={stream.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Layers size={16} className="text-indigo-600 dark:text-indigo-400" /></div>
                                    <div><p className="text-sm font-bold text-gray-900 dark:text-white">{stream.name}</p><p className="text-xs text-gray-500 dark:text-slate-400">{selectedClass?.name} • Stream</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setModal(null); navigate('/schooladmin/secondary/timetable') }} className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1">
                                        <CalendarDays size={12} /> Timetable
                                    </button>
                                    <button onClick={() => removeStream(stream.id, stream.name)} className="p-1.5 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                        {selectedClass?.streams.length === 0 && <div className="p-6 text-center text-gray-400 dark:text-slate-500 text-sm">No streams have been added to this class yet.</div>}
                    </div>

                    <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-3">Add New Stream</p>
                        <div className="flex gap-2">
                            <input className="input-field flex-1" placeholder={`e.g. ${selectedClass?.name?.replace('Senior ', 'S')}D`} value={newStreamName} onChange={e => setNewStreamName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addStream()} />
                            <button className="btn-primary" onClick={addStream} disabled={!newStreamName.trim() || actionLoading}><Plus size={14} /> {actionLoading ? 'Adding…' : 'Add Stream'}</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Manage Subjects Modal */}
            <Modal isOpen={modal === 'subjects'} onClose={() => setModal(null)} title={`Manage Subjects — ${selectedClass?.name}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveSubjects}>{actionLoading ? 'Saving…' : 'Save Subject Changes'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <p className="text-sm text-gray-600 dark:text-slate-300">Select which subjects should be taught in <strong>{selectedClass?.name}</strong>.</p>
                    {subjects.length === 0 && <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">No subjects exist yet — add subjects first in Configuration → Subjects.</p>}
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700 rounded-xl">
                        {subjects.map(subject => {
                            const isSelected = selectedSubjects.includes(subject.id);
                            return (
                                <label key={subject.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'}`} onClick={() => toggleSubject(subject.id)}>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-500'}`}>
                                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-400'}`}>{subject.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
