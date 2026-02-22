import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Clock, CheckCircle, FileText, Paperclip } from 'lucide-react'

const assignments = [
    { id: 1, title: 'Fractions & Decimals Worksheet', subject: 'Mathematics', teacher: 'Mr. Okello', dueDate: '2026-02-24', status: 'pending', description: 'Complete exercises 4.1–4.8 on fractions and decimal conversions.' },
    { id: 2, title: 'Book Review — Animal Farm', subject: 'English', teacher: 'Ms. Nassali', dueDate: '2026-02-26', status: 'pending', description: 'Write a 1-page review of Animal Farm by George Orwell.' },
    { id: 3, title: 'Cell Structure Diagram', subject: 'Science', teacher: 'Mr. Byaruhanga', dueDate: '2026-02-28', status: 'pending', description: 'Draw and label a plant and animal cell structure.' },
    { id: 4, title: 'Mental Math Test 3', subject: 'Mathematics', teacher: 'Mr. Okello', dueDate: '2026-02-20', status: 'submitted', score: 88, description: 'Completed in class — timed 30-minute assessment.' },
    { id: 5, title: 'Uganda Geography Map', subject: 'Social Studies', teacher: 'Ms. Acen', dueDate: '2026-02-15', status: 'graded', score: 91, description: 'Label all districts of Uganda on a blank map.' },
]

export default function StudentAssignments() {
    const [filter, setFilter] = useState('all')
    const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div><h1 className="page-title">My Assignments</h1><p className="page-subtitle">Track and submit your assignments</p></div>

                <div className="flex gap-2 flex-wrap">
                    {[['all', 'All'], ['pending', 'Pending'], ['submitted', 'Submitted'], ['graded', 'Graded']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilter(val)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === val ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filtered.map(a => (
                        <div key={a.id} className={`card border-2 hover:shadow-md transition-shadow ${a.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : a.status === 'submitted' ? 'border-blue-200' : 'border-emerald-200 bg-emerald-50/20'}`}>
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-bold text-gray-900">{a.title}</h3>
                                        <Badge variant={a.status === 'pending' ? 'warning' : a.status === 'submitted' ? 'info' : 'success'}>{a.status}</Badge>
                                        <Badge variant="purple">{a.subject}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{a.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                        <span>Teacher: {a.teacher}</span>
                                        <span className={`flex items-center gap-1 font-medium ${a.status === 'pending' && new Date(a.dueDate) <= new Date('2026-02-24') ? 'text-red-600' : 'text-gray-400'}`}>
                                            <Clock size={11} /> Due: {a.dueDate}
                                        </span>
                                        {a.score && <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle size={11} /> Score: {a.score}/100</span>}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    {a.status === 'pending' ? (
                                        <div className="flex flex-col gap-2">
                                            <button className="btn-primary text-xs py-1.5 px-3"><FileText size={12} /> Submit Work</button>
                                            <button className="btn-secondary text-xs py-1.5 px-3"><Paperclip size={12} /> Attach File</button>
                                        </div>
                                    ) : (
                                        <button className="btn-secondary text-xs py-1.5"><FileText size={12} /> View Submission</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
