import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { Plus, MapPin, Edit, Trash2, AlertCircle } from 'lucide-react'
import { classesApi } from '../../api/classes.api'
import { teachersApi } from '../../api/teachers.api'
import { timetableApi } from '../../api/schoolOps.api'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['8:00 AM - 9:20 AM', '9:20 AM - 10:40 AM', '11:00 AM - 12:20 PM', '1:20 PM - 2:40 PM', '2:40 PM - 4:00 PM']

export default function SchoolAdminTimetable({ role = "schooladmin-primary" }) {
    const [classes, setClasses] = useState([])
    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([])
    const [selectedClassId, setSelectedClassId] = useState('')
    const [selectedStreamId, setSelectedStreamId] = useState('')
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [actionError, setActionError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const [modal, setModal] = useState(false)
    const [formData, setFormData] = useState({ dayOfWeek: days[0], timeSlot: timeSlots[0], subjectId: '', teacherProfileId: '', room: '' })

    const loadBase = useCallback(async () => {
        setLoading(true); setLoadError('')
        try {
            const [classesResult, subjectsResult, teachersResult] = await Promise.all([classesApi.list(), classesApi.listSubjects(), teachersApi.list()])
            setClasses(classesResult)
            setSubjects(subjectsResult)
            setTeachers(teachersResult)
            if (classesResult.length > 0) setSelectedClassId(prev => prev || classesResult[0].id)
        } catch (err) {
            setLoadError(err.message || 'Failed to load timetable data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadBase() }, [loadBase])

    const loadEntries = useCallback(async () => {
        if (!selectedClassId) return
        try {
            setEntries(await timetableApi.getForClass(selectedClassId, selectedStreamId || undefined))
        } catch (err) {
            setLoadError(err.message || 'Failed to load class timetable')
        }
    }, [selectedClassId, selectedStreamId])

    useEffect(() => { loadEntries() }, [loadEntries])

    const openModal = (dayOfWeek = days[0], timeSlot = timeSlots[0], lesson = null) => {
        setFormData(lesson
            ? { dayOfWeek, timeSlot, subjectId: lesson.subjectId || '', teacherProfileId: lesson.teacherProfileId || '', room: lesson.room || '' }
            : { dayOfWeek, timeSlot, subjectId: '', teacherProfileId: '', room: '' })
        setModal(true)
        setActionError('')
    }

    const saveLesson = async () => {
        setActionLoading(true); setActionError('')
        try {
            await timetableApi.saveSlot({ classId: selectedClassId, streamId: selectedStreamId || undefined, ...formData })
            setModal(false); await loadEntries()
        } catch (err) { setActionError(err.message || 'Failed to save lesson') } finally { setActionLoading(false) }
    }

    const deleteLesson = async (dayOfWeek, timeSlot, e) => {
        e.stopPropagation()
        if (!window.confirm('Delete this lesson?')) return
        try {
            await timetableApi.deleteSlot(selectedClassId, { dayOfWeek, timeSlot, streamId: selectedStreamId || undefined })
            await loadEntries()
        } catch (err) { setActionError(err.message || 'Failed to delete lesson') }
    }

    const findEntry = (day, time) => entries.find(l => l.dayOfWeek === day && l.timeSlot === time)

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div><h1 className="page-title">Class Timetables</h1><p className="page-subtitle">Manage weekly schedules for all classes.</p></div>
                    <div className="flex items-center gap-3">
                        <select className="input-field py-2 bg-white dark:bg-slate-800" value={selectedClassId} onChange={(e) => { setSelectedClassId(e.target.value); setSelectedStreamId('') }}>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} Timetable</option>)}
                        </select>
                        {classes.find(c => c.id === selectedClassId)?.streams.length > 0 && (
                            <select className="input-field py-2 bg-white dark:bg-slate-800" value={selectedStreamId} onChange={(e) => setSelectedStreamId(e.target.value)}>
                                <option value="">All Streams</option>
                                {classes.find(c => c.id === selectedClassId).streams.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        )}
                        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Lesson</button>
                    </div>
                </div>

                {(loadError || actionError) && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2"><AlertCircle size={16} /> {loadError || actionError}</div>}

                {loading ? <p className="text-sm text-gray-400">Loading…</p> : (
                    <div className="card p-0 overflow-hidden">
                        <div className="overflow-x-auto custom-scrollbar"><table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 w-32 border-r border-slate-200 dark:border-slate-700">Time</th>
                                    {days.map(day => <th key={day} className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-center border-r border-slate-200 dark:border-slate-700 last:border-0">{day}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {timeSlots.map((time) => (
                                    <tr key={time} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 border-r border-slate-100 dark:border-slate-700/50 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30">{time}</td>
                                        {days.map(day => {
                                            const lesson = findEntry(day, time)
                                            return (
                                                <td key={day} onClick={() => !lesson && openModal(day, time)} className="p-2 border-r border-slate-100 dark:border-slate-700/50 last:border-0 align-top h-24 relative group cursor-pointer">
                                                    {lesson ? (
                                                        <div onClick={() => openModal(day, time, lesson)} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 h-full hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                                            <p className="font-bold text-blue-900 dark:text-blue-300 text-sm">{lesson.subject?.name || '—'}</p>
                                                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 truncate">{lesson.teacherProfile?.user?.fullName || '—'}</p>
                                                            {lesson.room && <div className="flex items-center gap-1 text-[10px] text-blue-500 dark:text-blue-300 mt-2 font-medium bg-blue-100 dark:bg-blue-800/50 w-max px-2 py-0.5 rounded"><MapPin size={10} /> {lesson.room}</div>}
                                                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 rounded p-1 shadow-sm backdrop-blur-sm">
                                                                <button className="p-1 hover:text-blue-600 dark:text-slate-300"><Edit size={12} /></button>
                                                                <button onClick={(e) => deleteLesson(day, time, e)} className="p-1 hover:text-red-600 dark:text-slate-300"><Trash2 size={12} /></button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 dark:text-blue-400">
                                                            <Plus size={20} />
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                    </div>
                )}
            </div>

            <Modal isOpen={modal} onClose={() => setModal(false)} title={`${formData.dayOfWeek} — ${formData.timeSlot}`}
                footer={<><button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button><button disabled={actionLoading} className="btn-primary" onClick={saveLesson}>{actionLoading ? 'Saving…' : 'Save Lesson'}</button></>}>
                <div className="space-y-4">
                    {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select className="select-field" value={formData.subjectId} onChange={e => setFormData(f => ({ ...f, subjectId: e.target.value }))}>
                            <option value="">Select subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                        <select className="select-field" value={formData.teacherProfileId} onChange={e => setFormData(f => ({ ...f, teacherProfileId: e.target.value }))}>
                            <option value="">Select teacher</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Room</label><input className="input-field" placeholder="Room 12" value={formData.room} onChange={e => setFormData(f => ({ ...f, room: e.target.value }))} /></div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
