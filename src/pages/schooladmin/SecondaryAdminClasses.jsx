import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Edit2, Trash2, Library, Users, Layers, CalendarDays, TrendingUp, TrendingDown, Award, BookOpen, AlertCircle, Medal, Crown, Eye } from 'lucide-react'

// Fixed secondary classes with streams
const initialClassesData = [
    { id: 'C-S1', name: 'Senior 1', level: 'O Level', students: 150, teachers: 8, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S1A', 'S1B', 'S1C'], performance: { bestStream: 'S1B', avgScore: '75%', passRate: '88%', bestSubjects: ['Mathematics', 'Geography'], worstSubjects: ['Physics'], topStudents: [
        { rank: 1, name: 'Mukasa Paul', stream: 'S1B', avg: 94 }, { rank: 2, name: 'Nanteza Diana', stream: 'S1A', avg: 92 }, { rank: 3, name: 'Odongo Mark', stream: 'S1C', avg: 90 }, { rank: 4, name: 'Nassali Grace', stream: 'S1B', avg: 88 }, { rank: 5, name: 'Kato Samuel', stream: 'S1A', avg: 86 }, { rank: 6, name: 'Auma Florence', stream: 'S1C', avg: 84 }, { rank: 7, name: 'Mugisha Ivan', stream: 'S1B', avg: 82 }, { rank: 8, name: 'Nakato Peace', stream: 'S1A', avg: 80 }, { rank: 9, name: 'Luswata Isaac', stream: 'S1C', avg: 78 }, { rank: 10, name: 'Byaruhanga Seth', stream: 'S1B', avg: 76 },
    ], allStudents: [] } },
    { id: 'C-S2', name: 'Senior 2', level: 'O Level', students: 145, teachers: 8, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S2A', 'S2B'], performance: { bestStream: 'S2A', avgScore: '80%', passRate: '92%', bestSubjects: ['English', 'History'], worstSubjects: ['Mathematics'], topStudents: [
        { rank: 1, name: 'Namaganda Sarah', stream: 'S2A', avg: 96 }, { rank: 2, name: 'Okello Denis', stream: 'S2B', avg: 93 }, { rank: 3, name: 'Wamala Peter', stream: 'S2A', avg: 91 }, { rank: 4, name: 'Nalubega Joy', stream: 'S2B', avg: 89 }, { rank: 5, name: 'Ssemanda Robert', stream: 'S2A', avg: 87 }, { rank: 6, name: 'Nansubuga Esther', stream: 'S2B', avg: 85 }, { rank: 7, name: 'Buyinza Moses', stream: 'S2A', avg: 83 }, { rank: 8, name: 'Acen Racheal', stream: 'S2B', avg: 81 }, { rank: 9, name: 'Katende Isaac', stream: 'S2A', avg: 79 }, { rank: 10, name: 'Nampijja Susan', stream: 'S2B', avg: 77 },
    ], allStudents: [] } },
    { id: 'C-S3', name: 'Senior 3', level: 'O Level', students: 130, teachers: 10, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S3A', 'S3B'], performance: { bestStream: 'S3B', avgScore: '72%', passRate: '85%', bestSubjects: ['Physics', 'Chemistry'], worstSubjects: ['Geography'], topStudents: [
        { rank: 1, name: 'Kato Samuel', stream: 'S3B', avg: 95 }, { rank: 2, name: 'Nakimera Gloria', stream: 'S3A', avg: 92 }, { rank: 3, name: 'Mugalu Peter', stream: 'S3B', avg: 90 }, { rank: 4, name: 'Kisakye Diana', stream: 'S3A', avg: 88 }, { rank: 5, name: 'Ssenabulya Dennis', stream: 'S3B', avg: 85 }, { rank: 6, name: 'Nandawula Hope', stream: 'S3A', avg: 83 }, { rank: 7, name: 'Lule Joshua', stream: 'S3B', avg: 81 }, { rank: 8, name: 'Mirembe Dorothy', stream: 'S3A', avg: 79 }, { rank: 9, name: 'Tusiime Alex', stream: 'S3B', avg: 77 }, { rank: 10, name: 'Nabukwasi Carol', stream: 'S3A', avg: 75 },
    ], allStudents: [] } },
    { id: 'C-S4', name: 'Senior 4', level: 'O Level', students: 125, teachers: 10, subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'], streams: ['S4A', 'S4B'], performance: { bestStream: 'S4A', avgScore: '78%', passRate: '90%', bestSubjects: ['Biology', 'English'], worstSubjects: ['Physics'], topStudents: [
        { rank: 1, name: 'Najjuma Faith', stream: 'S4A', avg: 97 }, { rank: 2, name: 'Ssekandi Ronald', stream: 'S4B', avg: 94 }, { rank: 3, name: 'Kirabo Patricia', stream: 'S4A', avg: 92 }, { rank: 4, name: 'Kayemba Patrick', stream: 'S4B', avg: 90 }, { rank: 5, name: 'Nalubega Mercy', stream: 'S4A', avg: 88 }, { rank: 6, name: 'Mugisha Emmanuel', stream: 'S4B', avg: 85 }, { rank: 7, name: 'Birungi Prossy', stream: 'S4A', avg: 83 }, { rank: 8, name: 'Odong Michael', stream: 'S4B', avg: 81 }, { rank: 9, name: 'Kamya Julius', stream: 'S4A', avg: 79 }, { rank: 10, name: 'Nalumansi Dorothy', stream: 'S4B', avg: 77 },
    ], allStudents: [] } },
    { id: 'C-S5', name: 'Senior 5', level: 'A Level', students: 80, teachers: 6, subjects: ['Mathematics', 'Physics', 'Economics', 'General Paper'], streams: ['S5'], performance: { bestStream: 'S5', avgScore: '70%', passRate: '82%', bestSubjects: ['Mathematics', 'Physics'], worstSubjects: ['General Paper'], topStudents: [
        { rank: 1, name: 'Opio Julius', stream: 'S5', avg: 93 }, { rank: 2, name: 'Nassali Barbara', stream: 'S5', avg: 91 }, { rank: 3, name: 'Ssenabulya Dennis', stream: 'S5', avg: 89 }, { rank: 4, name: 'Nandawula Hope', stream: 'S5', avg: 87 }, { rank: 5, name: 'Katende Isaac', stream: 'S5', avg: 84 }, { rank: 6, name: 'Mirembe Dorothy', stream: 'S5', avg: 82 }, { rank: 7, name: 'Lule Joshua', stream: 'S5', avg: 80 }, { rank: 8, name: 'Nabukwasi Carol', stream: 'S5', avg: 78 }, { rank: 9, name: 'Tusiime Alex', stream: 'S5', avg: 75 }, { rank: 10, name: 'Nampijja Susan', stream: 'S5', avg: 73 },
    ], allStudents: [] } },
    { id: 'C-S6', name: 'Senior 6', level: 'A Level', students: 75, teachers: 6, subjects: ['Mathematics', 'Physics', 'Economics', 'General Paper'], streams: ['S6'], performance: { bestStream: 'S6', avgScore: '76%', passRate: '89%', bestSubjects: ['Economics', 'General Paper'], worstSubjects: ['Physics'], topStudents: [
        { rank: 1, name: 'Babirye Mary', stream: 'S6', avg: 96 }, { rank: 2, name: 'Mugisha Collins', stream: 'S6', avg: 94 }, { rank: 3, name: 'Nabirye Karen', stream: 'S6', avg: 91 }, { rank: 4, name: 'Ochieng Tony', stream: 'S6', avg: 89 }, { rank: 5, name: 'Namutebi Winnie', stream: 'S6', avg: 87 }, { rank: 6, name: 'Kasozi Lawrence', stream: 'S6', avg: 85 }, { rank: 7, name: 'Nansereko Anita', stream: 'S6', avg: 82 }, { rank: 8, name: 'Mugalu Kenneth', stream: 'S6', avg: 80 }, { rank: 9, name: 'Apio Christine', stream: 'S6', avg: 78 }, { rank: 10, name: 'Okello John', stream: 'S6', avg: 75 },
    ], allStudents: [] } },
]

// Generate allStudents for each class
initialClassesData.forEach(cls => {
    const perf = cls.performance
    const extra = []
    const totalStudents = cls.students
    for (let i = perf.topStudents.length + 1; i <= Math.min(totalStudents, 40); i++) {
        const names = ['Mugisha', 'Nalwanga', 'Ssekandi', 'Kyomuhendo', 'Basalirwa', 'Acayo', 'Nankya', 'Luswata', 'Tusiime', 'Odong', 'Kamya', 'Nabukwasi', 'Katende', 'Nampijja', 'Bucyana', 'Birungi', 'Kasozi', 'Nansereko', 'Atim', 'Ochieng']
        const fnames = ['Isaac', 'Grace', 'Paul', 'Hope', 'Frank', 'Carol', 'Alex', 'Susan', 'Moses', 'Harriet', 'Joshua', 'Dorothy', 'Martin', 'Ruth', 'Simon', 'Patricia', 'Denis', 'Esther', 'Racheal', 'Kevin']
        extra.push({ rank: i, name: `${names[(i * 3) % names.length]} ${fnames[(i * 7) % fnames.length]}`, stream: cls.streams[i % cls.streams.length], avg: Math.max(20, 78 - (i - 10) * 2 + Math.floor(Math.random() * 8)) })
    }
    perf.allStudents = [...perf.topStudents, ...extra].sort((a, b) => b.avg - a.avg).map((s, idx) => ({ ...s, rank: idx + 1 }))
})

// System-wide subjects
const secondarySubjects = [
    'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
    'History', 'Geography', 'Agriculture', 'Literature',
    'Fine Art', 'Computer Studies', 'Entrepreneurship', 'CRE',
    'General Paper', 'Economics', 'Sub-Math'
]

const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={14} className="text-amber-500" />
    if (rank === 2) return <Medal size={14} className="text-slate-400" />
    if (rank === 3) return <Medal size={14} className="text-amber-700" />
    return null
}

const getRankBg = (rank) => {
    if (rank === 1) return 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800/40'
    if (rank === 2) return 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'
    if (rank === 3) return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30'
    return 'bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50'
}

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 75) return 'text-blue-600 dark:text-blue-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
}

export default function SecondaryAdminClasses() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selectedClass, setSelectedClass] = useState(null)
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [classesData, setClassesData] = useState(initialClassesData)
    const [newStreamName, setNewStreamName] = useState('')
    const [showAllStudents, setShowAllStudents] = useState(false)

    const filteredClasses = classesData.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.level.toLowerCase().includes(search.toLowerCase())
    )

    const openSubjectModal = (cls) => { setSelectedClass(cls); setSelectedSubjects(cls.subjects); setModal('subjects') }
    const openStreamsModal = (cls) => { setSelectedClass(cls); setNewStreamName(''); setModal('streams') }
    const openPerformanceModal = (cls) => { setSelectedClass(cls); setShowAllStudents(false); setModal('performance') }

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
        if (selectedClass.streams.includes(streamName)) return
        setClassesData(prev => prev.map(cls => cls.id === selectedClass.id ? { ...cls, streams: [...cls.streams, streamName] } : cls))
        setSelectedClass(prev => ({ ...prev, streams: [...prev.streams, streamName] }))
        setNewStreamName('')
    }

    const removeStream = (streamName) => {
        if (!selectedClass) return
        if (window.confirm(`Remove stream "${streamName}" from ${selectedClass.name}?`)) {
            setClassesData(prev => prev.map(cls => cls.id === selectedClass.id ? { ...cls, streams: cls.streams.filter(s => s !== streamName) } : cls))
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
                        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search classes..." />
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
                                <button onClick={() => openPerformanceModal(cls)} className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-800/50" title="View Academic Performance">
                                    <TrendingUp size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <div><p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Students</p><p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.students}</p></div>
                                <div><p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Teachers</p><p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Users size={12} className="text-gray-400 dark:text-slate-500" /> {cls.teachers}</p></div>
                                <div><p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Streams</p><p className="text-sm font-semibold flex items-center gap-1 mt-0.5 dark:text-slate-200"><Layers size={12} className="text-gray-400 dark:text-slate-500" /> {cls.streams.length}</p></div>
                            </div>
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-2">Streams</p>
                                <div className="flex flex-wrap gap-1.5">{cls.streams.map(stream => (<span key={stream} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-md">{stream}</span>))}</div>
                            </div>
                            <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-2">Subjects ({cls.subjects.length})</p>
                                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto custom-scrollbar pr-1">{cls.subjects.map(subject => (<span key={subject} className="px-2 py-1 bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-xs font-medium rounded-md">{subject}</span>))}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => openStreamsModal(cls)} className="py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-2"><Layers size={14} /> View Streams</button>
                                <button onClick={() => openSubjectModal(cls)} className="py-2 bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/60 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-lg border border-gray-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-2"><Library size={14} /> Manage Subjects</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Streams Modal */}
            <Modal isOpen={modal === 'streams'} onClose={() => setModal(null)} title={`Streams — ${selectedClass?.name}`} size="lg" footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Close</button></>}>
                <div className="space-y-5">
                    <p className="text-sm text-gray-600 dark:text-slate-300">All streams under <strong className="dark:text-white">{selectedClass?.name}</strong>. Each stream has its own timetable and student list.</p>
                    <div className="space-y-2">
                        {selectedClass?.streams.map(stream => (
                            <div key={stream} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center"><Layers size={16} className="text-indigo-600 dark:text-indigo-400" /></div>
                                    <div><p className="text-sm font-bold text-gray-900 dark:text-white">{stream}</p><p className="text-xs text-gray-500 dark:text-slate-400">{selectedClass?.name} • Stream</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => navigate(`/schooladmin/secondary/timetable?stream=${stream}`)} className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1"><CalendarDays size={12} /> Timetable</button>
                                    <button onClick={() => removeStream(stream)} className="p-1.5 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                        {selectedClass?.streams.length === 0 && <div className="p-6 text-center text-gray-400 dark:text-slate-500 text-sm">No streams have been added to this class yet.</div>}
                    </div>
                    <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500 mb-3">Add New Stream</p>
                        <div className="flex gap-2">
                            <input className="input-field flex-1" placeholder={`e.g. ${selectedClass?.name?.replace('Senior ', 'S')}D`} value={newStreamName} onChange={e => setNewStreamName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addStream()} />
                            <button className="btn-primary" onClick={addStream} disabled={!newStreamName.trim()}><Plus size={14} /> Add Stream</button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Manage Subjects Modal */}
            <Modal isOpen={modal === 'subjects'} onClose={() => setModal(null)} title={`Manage Subjects — ${selectedClass?.name}`} size="lg" footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}>Save Subject Changes</button></>}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300">Select which subjects should be taught in <strong>{selectedClass?.name}</strong>.</p>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700 rounded-xl">
                        {secondarySubjects.map(subject => {
                            const isSelected = selectedSubjects.includes(subject);
                            return (
                                <label key={subject} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-sm' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600'}`} onClick={() => toggleSubject(subject)}>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-slate-500'}`}>{isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}</div>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-400'}`}>{subject}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            </Modal>

            {/* Academic Performance Modal - Enhanced */}
            <Modal isOpen={modal === 'performance'} onClose={() => setModal(null)} title={`Academic Performance — ${selectedClass?.name}`} size="xl" footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Close</button></>}>
                {selectedClass && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-xl text-center">
                                <TrendingUp size={18} className="mx-auto text-emerald-500 mb-1" /><p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Avg Score</p><p className="text-xl font-bold text-gray-900 dark:text-white">{selectedClass.performance.avgScore}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl text-center">
                                <Award size={18} className="mx-auto text-blue-500 mb-1" /><p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Pass Rate</p><p className="text-xl font-bold text-gray-900 dark:text-white">{selectedClass.performance.passRate}</p>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-4 rounded-xl text-center">
                                <Layers size={18} className="mx-auto text-indigo-500 mb-1" /><p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Best Stream</p><p className="text-xl font-bold text-gray-900 dark:text-white">{selectedClass.performance.bestStream}</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 p-4 rounded-xl text-center">
                                <Users size={18} className="mx-auto text-purple-500 mb-1" /><p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total Students</p><p className="text-xl font-bold text-gray-900 dark:text-white">{selectedClass.students}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3"><div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><BookOpen size={14} className="text-emerald-600 dark:text-emerald-400" /></div><h4 className="font-semibold text-sm text-gray-900 dark:text-white">Best Done Subjects</h4></div>
                                <ul className="space-y-1.5">{selectedClass.performance.bestSubjects.map((sub, idx) => (<li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300"><span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-100 dark:border-emerald-800/30">{idx + 1}</span>{sub}</li>))}</ul>
                            </div>
                            <div className="border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-3"><div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><AlertCircle size={14} className="text-red-600 dark:text-red-400" /></div><h4 className="font-semibold text-sm text-gray-900 dark:text-white">Needs Improvement</h4></div>
                                <ul className="space-y-1.5">{selectedClass.performance.worstSubjects.map((sub, idx) => (<li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300"><span className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold border border-red-100 dark:border-red-800/30">!</span>{sub}</li>))}</ul>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Crown size={16} className="text-amber-500" /> Top 10 Scholars</h4>
                                <button onClick={() => setShowAllStudents(!showAllStudents)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"><Eye size={12} /> {showAllStudents ? 'Show Top 10 Only' : `View All Students (${selectedClass.performance.allStudents.length})`}</button>
                            </div>
                            <div className="space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                                {(showAllStudents ? selectedClass.performance.allStudents : selectedClass.performance.topStudents).map((student) => (
                                    <div key={student.rank} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${getRankBg(student.rank)}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${student.rank <= 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}>{student.rank}</div>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">{student.name.split(' ').map(n => n[0]).join('')}</div>
                                        <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1.5">{student.name} {getRankIcon(student.rank)}</p><p className="text-xs text-gray-500 dark:text-slate-400">{student.stream}</p></div>
                                        <div className="text-right"><p className={`text-sm font-bold ${getScoreColor(student.avg)}`}>{student.avg}%</p><div className="w-16 bg-gray-100 dark:bg-slate-700 rounded-full h-1 mt-1"><div className={`h-1 rounded-full ${student.avg >= 80 ? 'bg-emerald-500' : student.avg >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${student.avg}%` }} /></div></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
