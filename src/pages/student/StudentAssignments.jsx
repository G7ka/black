import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { ClipboardList, Clock, CheckCircle2, AlertCircle, User, CalendarDays, ChevronDown, ChevronUp, BookOpen, AlertTriangle, Send } from 'lucide-react'

const completedAssignments = [
    { id: 1, subject: 'Mathematics', title: 'Algebra — Quadratic Equations', teacher: 'Mr. Kenneth Okello', dueDate: '2026-02-25', submittedDate: '2026-02-24', score: 85, total: 100, grade: 'A', feedback: 'Excellent work on the factoring section. Review completing the square method.' },
    { id: 2, subject: 'English', title: 'Essay — My Favourite Holiday', teacher: 'Ms. Grace Achieng', dueDate: '2026-02-22', submittedDate: '2026-02-22', score: 72, total: 100, grade: 'B+', feedback: 'Good structure and vocabulary. Watch out for run-on sentences in paragraph 3.' },
    { id: 3, subject: 'Science', title: 'Lab Report — Photosynthesis Experiment', teacher: 'Dr. Peter Mugisha', dueDate: '2026-02-20', submittedDate: '2026-02-19', score: 90, total: 100, grade: 'A+', feedback: 'Outstanding lab report. Hypothesis was well-stated and conclusions were accurate.' },
    { id: 4, subject: 'Social Studies', title: 'Research — The Nile Basin Initiative', teacher: 'Mrs. Harriet Nambi', dueDate: '2026-02-18', submittedDate: '2026-02-18', score: 65, total: 100, grade: 'B', feedback: 'Good research but citations need improvement. Include at least 3 primary sources next time.' },
    { id: 5, subject: 'Mathematics', title: 'Geometry — Circle Theorems', teacher: 'Mr. Kenneth Okello', dueDate: '2026-02-14', submittedDate: '2026-02-13', score: 78, total: 100, grade: 'B+', feedback: 'Solid understanding of tangent properties. Practise more on cyclic quadrilateral proofs.' },
]

const upcomingAssignments = [
    { id: 6, subject: 'English', title: 'Book Review — Things Fall Apart', teacher: 'Ms. Grace Achieng', assignedDate: '2026-02-28', dueDate: '2026-03-07' },
    { id: 7, subject: 'Science', title: 'Research Paper — Renewable Energy in Uganda', teacher: 'Dr. Peter Mugisha', assignedDate: '2026-03-01', dueDate: '2026-03-10' },
    { id: 8, subject: 'Mathematics', title: 'Problem Set — Trigonometry Identities', teacher: 'Mr. Kenneth Okello', assignedDate: '2026-03-03', dueDate: '2026-03-06' },
]

const gradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-red-600 bg-red-50 border-red-200'
}

const scoreBarColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500'
    if (pct >= 60) return 'bg-blue-500'
    if (pct >= 40) return 'bg-amber-500'
    return 'bg-red-500'
}

const daysUntil = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Overdue'
    if (diff === 0) return 'Due today'
    if (diff === 1) return 'Due tomorrow'
    return `${diff} days left`
}

const urgencyColor = (dateStr) => {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    if (diff <= 1) return 'warning'
    if (diff <= 3) return 'info'
    return 'success'
}

export default function StudentAssignments() {
    const [expandedId, setExpandedId] = useState(null)
    const [tab, setTab] = useState('upcoming')
    const [reportModal, setReportModal] = useState(false)
    const [reportTeacher, setReportTeacher] = useState('')
    const [reportSubject, setReportSubject] = useState('')
    const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10))
    const [reportMsg, setReportMsg] = useState('')
    const [reportSuccess, setReportSuccess] = useState('')

    const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id)
    const avgScore = Math.round(completedAssignments.reduce((sum, a) => sum + a.score, 0) / completedAssignments.length)

    const submitReport = () => {
        if (!reportTeacher.trim() || !reportSubject.trim()) return
        setReportSuccess(`Report submitted: ${reportTeacher} missed ${reportSubject} on ${reportDate}. The school admin has been notified.`)
        setReportModal(false)
        setReportTeacher(''); setReportSubject(''); setReportMsg('')
        setTimeout(() => setReportSuccess(''), 5000)
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-6 relative">

                {reportSuccess && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl shadow-lg max-w-md">
                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold text-sm">{reportSuccess}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title flex items-center gap-2"><ClipboardList size={22} className="text-blue-500" /> My Assignments</h1>
                        <p className="page-subtitle">Track your assignments, view results, and check upcoming deadlines.</p>
                    </div>
                    <button className="btn-secondary text-sm flex items-center gap-2" onClick={() => setReportModal(true)}>
                        <AlertTriangle size={15} /> Report Missed Lesson
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card text-center">
                        <CheckCircle2 size={22} className="mx-auto text-emerald-500 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Completed</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{completedAssignments.length}</p>
                    </div>
                    <div className="card text-center">
                        <Clock size={22} className="mx-auto text-amber-500 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Upcoming</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingAssignments.length}</p>
                    </div>
                    <div className="card text-center">
                        <BookOpen size={22} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Average Score</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{avgScore}%</p>
                    </div>
                    <div className="card text-center">
                        <AlertCircle size={22} className="mx-auto text-red-500 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Overdue</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-md">
                    {[
                        { id: 'upcoming', label: `Upcoming (${upcomingAssignments.length})` },
                        { id: 'completed', label: `Completed (${completedAssignments.length})` },
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
                    ))}
                </div>

                {/* Upcoming — just titles, teacher, due date (no questions) */}
                {tab === 'upcoming' && (
                    <div className="space-y-3">
                        {upcomingAssignments.map(a => (
                            <div key={a.id} className="card border-l-4 border-blue-400 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <Badge variant="info">{a.subject}</Badge>
                                            <Badge variant={urgencyColor(a.dueDate)}>{daysUntil(a.dueDate)}</Badge>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base">{a.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><User size={11} /> {a.teacher}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end"><CalendarDays size={11} /> Assigned: {a.assignedDate}</p>
                                        <p className="text-sm font-bold text-gray-700 mt-1 flex items-center gap-1 justify-end"><Clock size={12} /> Due: {a.dueDate}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {upcomingAssignments.length === 0 && (
                            <div className="card p-10 text-center text-gray-400">No upcoming assignments. Enjoy your free time! 🎉</div>
                        )}
                    </div>
                )}

                {/* Completed — expandable for feedback */}
                {tab === 'completed' && (
                    <div className="space-y-3">
                        {completedAssignments.map(a => {
                            const pct = Math.round((a.score / a.total) * 100)
                            const isExpanded = expandedId === a.id
                            return (
                                <div key={a.id} className="card hover:shadow-md transition-shadow">
                                    <button onClick={() => toggleExpand(a.id)} className="w-full text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <Badge variant="info">{a.subject}</Badge>
                                                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${gradeColor(a.grade)}`}>{a.grade}</span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-sm">{a.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><User size={11} /> {a.teacher}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-extrabold text-gray-900">{a.score}<span className="text-sm text-gray-400 font-normal">/{a.total}</span></p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-20 h-2 bg-gray-100 rounded-full">
                                                            <div className={`h-2 rounded-full ${scoreBarColor(pct)}`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className="text-xs text-gray-400">{pct}%</span>
                                                    </div>
                                                </div>
                                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                                                <div><span className="text-gray-400">Due Date</span><p className="font-semibold text-gray-700">{a.dueDate}</p></div>
                                                <div><span className="text-gray-400">Submitted</span><p className="font-semibold text-gray-700">{a.submittedDate}</p></div>
                                                <div><span className="text-gray-400">Teacher</span><p className="font-semibold text-gray-700">{a.teacher}</p></div>
                                            </div>
                                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <p className="text-xs font-semibold text-blue-700 mb-1">Teacher Feedback</p>
                                                <p className="text-sm text-blue-800">{a.feedback}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Report Missed Lesson Modal */}
            <Modal isOpen={reportModal} onClose={() => setReportModal(false)} title="Report a Missed Lesson"
                footer={<><button className="btn-secondary" onClick={() => setReportModal(false)}>Cancel</button><button className="btn-primary" onClick={submitReport} disabled={!reportTeacher.trim() || !reportSubject.trim()}><Send size={14} /> Submit Report</button></>}>
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-700">This report will be sent to the school admin with your name, class, and profile details. Only submit genuine reports.</p>
                    </div>

                    {/* Student info preview */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="Student" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                            <p className="text-sm font-bold text-gray-900">Ivan Namukasa</p>
                            <p className="text-xs text-gray-500">P.7 Blue • Student ID: STU-2026-019</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name *</label>
                            <input className="input-field" placeholder="e.g. Mr. Kenneth Okello" value={reportTeacher} onChange={e => setReportTeacher(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                            <input className="input-field" placeholder="e.g. Mathematics" value={reportSubject} onChange={e => setReportSubject(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Missed Lesson</label>
                        <input type="date" className="input-field" value={reportDate} onChange={e => setReportDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (optional)</label>
                        <textarea className="input-field resize-none" rows={2} placeholder="Any extra info about the missed lesson..." value={reportMsg} onChange={e => setReportMsg(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
