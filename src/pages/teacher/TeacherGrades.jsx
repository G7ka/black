import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { Save, Download, FileText, Plus } from 'lucide-react'

const students = ['Ivan Namukasa', 'Grace Mukasa', 'Moses Achola', 'Esther Akello', 'Brian Mwesige', 'Joy Apio']
const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Religious Ed.']

const generateGrades = () => {
    const g = {}
    students.forEach(s => {
        g[s] = {}
        subjects.forEach(sub => { g[s][sub] = Math.floor(Math.random() * 40) + 50 })
    })
    return g
}

const history = [
    { term: 'Term 2, 2025', class: 'P6A', subject: 'Mathematics', avg: '74%', highest: 'Grace M. (92)', lowest: 'Moses A. (51)' },
    { term: 'Term 1, 2025', class: 'P6A', subject: 'Mathematics', avg: '68%', highest: 'Esther A. (88)', lowest: 'Brian M. (48)' },
]

export default function TeacherGrades() {
    const [selectedClass, setSelectedClass] = useState('P6A')
    const [selectedTerm, setSelectedTerm] = useState('Term 1, 2026')
    const [grades, setGrades] = useState(generateGrades)
    const [tab, setTab] = useState('entry')
    const [saved, setSaved] = useState(false)

    const setGrade = (student, subject, val) => {
        setGrades(prev => ({ ...prev, [student]: { ...prev[student], [subject]: val } }))
    }

    const getColor = (v) => v >= 80 ? 'text-emerald-600' : v >= 60 ? 'text-amber-600' : 'text-red-600'

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Grades</h1><p className="page-subtitle">Enter and review grades for your classes</p></div>
                    <button className="btn-secondary"><Download size={15} /> Export Report</button>
                </div>

                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-xs">
                    {['entry', 'history'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'}`}>{t === 'entry' ? 'Grade Entry' : 'History'}</button>
                    ))}
                </div>

                {tab === 'entry' && (
                    <>
                        <div className="card flex flex-wrap gap-4">
                            <div><label className="block text-xs text-gray-500 font-medium mb-1">Class</label>
                                <div className="flex gap-2">{['P6A', 'P7B'].map(c => <button key={c} onClick={() => setSelectedClass(c)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedClass === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{c}</button>)}</div>
                            </div>
                            <div><label className="block text-xs text-gray-500 font-medium mb-1">Term</label>
                                <select className="select-field" value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}>
                                    {['Term 1, 2026', 'Term 2, 2025', 'Term 1, 2025'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="card p-0 overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr>
                                        <th className="table-header sticky left-0 bg-gray-50">Student</th>
                                        {subjects.map(s => <th key={s} className="table-header text-center">{s}</th>)}
                                        <th className="table-header text-center bg-blue-50">Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(s => {
                                        const avg = Math.round(Object.values(grades[s] || {}).reduce((a, b) => a + Number(b), 0) / subjects.length)
                                        return (
                                            <tr key={s} className="hover:bg-blue-50/30">
                                                <td className="table-cell font-semibold sticky left-0 bg-white">{s}</td>
                                                {subjects.map(sub => (
                                                    <td key={sub} className="table-cell text-center p-2">
                                                        <input
                                                            type="number" min="0" max="100"
                                                            value={grades[s]?.[sub] ?? ''}
                                                            onChange={e => setGrade(s, sub, e.target.value)}
                                                            className={`w-16 text-center px-2 py-1 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 ${getColor(grades[s]?.[sub])}`}
                                                        />
                                                    </td>
                                                ))}
                                                <td className={`table-cell text-center font-bold text-base ${getColor(avg)}`}>{avg}%</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setSaved(true)} className="btn-primary"><Save size={14} /> {saved ? 'Grades Saved ✓' : 'Save Grades'}</button>
                            <button className="btn-secondary"><FileText size={14} /> Generate Report</button>
                        </div>
                    </>
                )}

                {tab === 'history' && (
                    <div className="card">
                        <h2 className="section-title">Grade History</h2>
                        <table className="w-full">
                            <thead><tr>{['Term', 'Class', 'Subject', 'Class Average', 'Highest', 'Lowest'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-medium">{h.term}</td>
                                        <td className="table-cell"><Badge variant="info">{h.class}</Badge></td>
                                        <td className="table-cell">{h.subject}</td>
                                        <td className="table-cell font-semibold text-primary-700">{h.avg}</td>
                                        <td className="table-cell text-emerald-700 text-sm">{h.highest}</td>
                                        <td className="table-cell text-red-600 text-sm">{h.lowest}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
