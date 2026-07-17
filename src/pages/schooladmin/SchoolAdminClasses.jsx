import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Edit2, Trash2, Library, Users, AlertCircle } from 'lucide-react'
import { classesApi } from '../../api/classes.api'

export default function SchoolAdminClasses() {
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedSubjects, setSelectedSubjects] = useState([])

    const [classes, setClasses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [newClassName, setNewClassName] = useState('')
    const [newClassTier, setNewClassTier] = useState('Lower Primary')

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const [classesResult, subjectsResult] = await Promise.all([classesApi.list(), classesApi.listSubjects()])
            setClasses(classesResult)
            setSubjects(subjectsResult)
        } catch (err) {
            setLoadError(err.message || 'Failed to load classes')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || (c.tier || '').toLowerCase().includes(search.toLowerCase())
    )

    const openSubjectModal = (cls) => {
        setSelectedClass(cls)
        setSelectedSubjects(cls.subjects.map(s => s.id))
        setModal('subjects')
        setActionError('')
    }

    const toggleSubject = (subjectId) => {
        setSelectedSubjects(prev => prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId])
    }

    const saveSubjects = async () => {
        setActionLoading(true)
        setActionError('')
        try {
            await classesApi.setSubjects(selectedClass.id, selectedSubjects)
            await load()
            setModal(null)
        } catch (err) {
            setActionError(err.message || 'Failed to save subjects')
        } finally {
            setActionLoading(false)
        }
    }

    const createClass = async () => {
        if (!newClassName.trim()) return
        setActionLoading(true)
        setActionError('')
        try {
            await classesApi.create({ name: newClassName.trim(), tier: newClassTier })
            await load()
            setModal(null)
            setNewClassName('')
        } catch (err) {
            setActionError(err.message || 'Failed to create class')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <DashboardLayout role="schooladmin-primary">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Primary Classes</h1>
                        <p className="page-subtitle">Manage class streams and assign subjects</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setModal('addClass'); setActionError('') }}><Plus size={15} /> Add New Class</button>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field pl-9"
                            placeholder="Search classes..."
                        />
                    </div>
                </div>

                {loadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {loadError}
                    </div>
                )}

                {loading && <p className="text-sm text-gray-400">Loading classes…</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && filteredClasses.map((cls) => (
                        <div key={cls.id} className="card p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cls.name}</h3>
                                    {cls.tier && <Badge variant={cls.tier.includes('Lower') ? 'info' : 'success'} className="mt-1">{cls.tier}</Badge>}
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded" title="Edit Class"><Edit2 size={14} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 mb-5 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Students</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.studentCount ?? 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Streams</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.streams.length || 'None'}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500">Assigned Subjects ({cls.subjects.length})</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-4 max-h-20 overflow-y-auto custom-scrollbar pr-1">
                                    {cls.subjects.map(subject => (
                                        <span key={subject.id} className="px-2 py-1 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md">
                                            {subject.name}
                                        </span>
                                    ))}
                                    {cls.subjects.length === 0 && <span className="text-xs text-gray-400">No subjects assigned yet</span>}
                                </div>
                                <button
                                    onClick={() => openSubjectModal(cls)}
                                    className="w-full py-2 bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Library size={14} /> Manage Subjects
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && filteredClasses.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">No classes yet — add your first class above.</p>
                )}
            </div>

            {/* Manage Subjects Modal */}
            <Modal isOpen={modal === 'subjects'} onClose={() => setModal(null)} title={`Manage Subjects — ${selectedClass?.name}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveSubjects}>{actionLoading ? 'Saving…' : 'Save Subject Changes'}</button></>}>

                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <p className="text-sm text-gray-600 dark:text-slate-300">Select which subjects should be taught in <strong>{selectedClass?.name}</strong>. Teachers can only assign grades for subjects selected here.</p>
                    {subjects.length === 0 && (
                        <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">No subjects exist yet — add subjects first in Configuration → Subjects.</p>
                    )}
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700 rounded-xl">
                        {subjects.map(subject => {
                            const isSelected = selectedSubjects.includes(subject.id);
                            return (
                                <label
                                    key={subject.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'}`}
                                    onClick={() => toggleSubject(subject.id)}
                                >
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

            {/* Add Class Modal */}
            <Modal isOpen={modal === 'addClass'} onClose={() => setModal(null)} title="Create New Class"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={actionLoading || !newClassName.trim()} className="btn-primary" onClick={createClass}><Plus size={14} /> {actionLoading ? 'Creating…' : 'Create Class'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Class Name</label>
                        <input type="text" className="input-field" placeholder="e.g., Senior 1, Primary 8..." value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Education Level</label>
                        <select className="select-field" value={newClassTier} onChange={e => setNewClassTier(e.target.value)}>
                            <option>Nursery</option>
                            <option>Lower Primary</option>
                            <option>Upper Primary</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
