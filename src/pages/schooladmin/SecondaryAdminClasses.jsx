import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Edit2, Trash2, Library, Users, Layers, CalendarDays } from 'lucide-react'

// Fixed secondary classes with streams
const initialClassesData = [
    { id: 'C-S1', name: 'Senior 1', level: 'O Level', students: 150, teachers: 8, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S1A', 'S1B', 'S1C'] },
    { id: 'C-S2', name: 'Senior 2', level: 'O Level', students: 145, teachers: 8, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S2A', 'S2B'] },
    { id: 'C-S3', name: 'Senior 3', level: 'O Level', students: 130, teachers: 10, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S3A', 'S3B'] },
    { id: 'C-S4', name: 'Senior 4', level: 'O Level', students: 125, teachers: 10, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S4A', 'S4B'] },
    { id: 'C-S5', name: 'Senior 5', level: 'A Level', students: 80, teachers: 6, subjects: ['Mathematics', 'Physics', 'Economics', 'General Paper'], streams: ['S5'] },
    { id: 'C-S6', name: 'Senior 6', level: 'A Level', students: 75, teachers: 6, subjects: ['Mathematics', 'Physics', 'Economics', 'General Paper'], streams: ['S6'] },
]

// System-wide subjects that can be assigned to secondary classes
const secondarySubjects = [
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Agriculture', 'Literature',
    'Fine Art', 'Computer Studies', 'Entrepreneurship', 'CRE',
    'General Paper', 'Economics', 'Sub-Math'
]

export default function SecondaryAdminClasses() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [classesData, setClassesData] = useState(initialClassesData)
    const [newStreamName, setNewStreamName] = useState('')

    const filteredClasses = classesData.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.level.toLowerCase().includes(search.toLowerCase())
    )

    const openSubjectModal = (cls) => {
        setSelectedClass(cls)
        setSelectedSubjects(cls.subjects)
        setModal('subjects')
    }

    const openStreamsModal = (cls) => {
        setSelectedClass(cls)
        setNewStreamName('')
        setModal('streams')
    }

    const toggleSubject = (subject) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subject))
        } else {
            setSelectedSubjects([...selectedSubjects, subject])
        }
    }

    const addStream = () => {
        if (!newStreamName.trim() || !selectedClass) return
        const streamName = newStreamName.trim().toUpperCase()
        // Check if stream already exists
        if (selectedClass.streams.includes(streamName)) return
        setClassesData(prev => prev.map(cls =>
            cls.id === selectedClass.id
                ? { ...cls, streams: [...cls.streams, streamName] }
                : cls
        ))
        setSelectedClass(prev => ({ ...prev, streams: [...prev.streams, streamName] }))
        setNewStreamName('')
    }

    const removeStream = (streamName) => {
        if (!selectedClass) return
        if (window.confirm(`Remove stream "${streamName}" from ${selectedClass.name}?`)) {
            setClassesData(prev => prev.map(cls =>
                cls.id === selectedClass.id
                    ? { ...cls, streams: cls.streams.filter(s => s !== streamName) }
                    : cls
            ))
            setSelectedClass(prev => ({ ...prev, streams: prev.streams.filter(s => s !== streamName) }))
        }
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => (
                        <div key={cls.id} className="card p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cls.name}</h3>
                                    <Badge variant={cls.level === 'A Level' ? 'info' : 'success'} className="mt-1">{cls.level}</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Students</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.students}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Teachers</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.teachers}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Streams</p>
                                    <p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Layers size={12} className="text-gray-400 dark:text-slate-500" /> {cls.streams.length}</p>
                                </div>
                            </div>

                            {/* Streams preview */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-2">Streams</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {cls.streams.map(stream => (
                                        <span key={stream} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md">
                                            {stream}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Subjects preview */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-2">Subjects ({cls.subjects.length})</p>
                                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto custom-scrollbar pr-1">
                                    {cls.subjects.map(subject => (
                                        <span key={subject} className="px-2 py-1 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md">
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => openStreamsModal(cls)}
                                    className="py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Layers size={14} /> View Streams
                                </button>
                                <button
                                    onClick={() => openSubjectModal(cls)}
                                    className="py-2 bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Library size={14} /> Manage Subjects
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Streams Modal */}
            <Modal isOpen={modal === 'streams'} onClose={() => setModal(null)} title={`Streams — ${selectedClass?.name}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Close</button></>}>
                <div className="space-y-5">
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                        All streams under <strong className="dark:text-white">{selectedClass?.name}</strong>. Each stream has its own timetable and student list.
                    </p>

                    {/* Existing streams */}
                    <div className="space-y-2">
                        {selectedClass?.streams.map(stream => (
                            <div key={stream} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{stream}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">{selectedClass?.name} • Stream</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/schooladmin/secondary/timetable?stream=${stream}`)}
                                        className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <CalendarDays size={12} /> Timetable
                                    </button>
                                    <button
                                        onClick={() => removeStream(stream)}
                                        className="p-1.5 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {selectedClass?.streams.length === 0 && (
                            <div className="p-6 text-center text-gray-400 dark:text-slate-500 text-sm">No streams have been added to this class yet.</div>
                        )}
                    </div>

                    {/* Add new stream */}
                    <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-3">Add New Stream</p>
                        <div className="flex gap-2">
                            <input
                                className="input-field flex-1"
                                placeholder={`e.g. ${selectedClass?.name?.replace('Senior ', 'S')}D`}
                                value={newStreamName}
                                onChange={e => setNewStreamName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addStream()}
                            />
                            <button className="btn-primary" onClick={addStream} disabled={!newStreamName.trim()}>
                                <Plus size={14} /> Add Stream
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Manage Subjects Modal */}
            <Modal isOpen={modal === 'subjects'} onClose={() => setModal(null)} title={`Manage Subjects — ${selectedClass?.name}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}>Save Subject Changes</button></>}>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300">Select which subjects should be taught in <strong>{selectedClass?.name}</strong>. Teachers can only assign grades for subjects selected here.</p>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700 rounded-xl">
                        {secondarySubjects.map(subject => {
                            const isSelected = selectedSubjects.includes(subject);
                            return (
                                <label
                                    key={subject}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'}`}
                                    onClick={() => toggleSubject(subject)}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-500'}`}>
                                        {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-400'}`}>{subject}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
