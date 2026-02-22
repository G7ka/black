import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'

const grades = {
    'Term 1, 2026': { Mathematics: 88, English: 82, Science: 75, 'Social Studies': 91, 'Religious Ed.': 79 },
    'Term 2, 2025': { Mathematics: 80, English: 79, Science: 70, 'Social Studies': 85, 'Religious Ed.': 76 },
    'Term 1, 2025': { Mathematics: 74, English: 72, Science: 65, 'Social Studies': 80, 'Religious Ed.': 70 },
}

const letterGrade = (s) => s >= 90 ? 'A' : s >= 80 ? 'B+' : s >= 70 ? 'B' : s >= 60 ? 'C' : 'D'
const gradeVariant = (s) => s >= 80 ? 'success' : s >= 60 ? 'warning' : 'danger'

export default function ParentGrades() {
    const [term, setTerm] = useState('Term 1, 2026')
    const current = grades[term]
    const avg = Math.round(Object.values(current).reduce((a, b) => a + b, 0) / Object.keys(current).length)

    return (
        <DashboardLayout role="parent">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div><h1 className="page-title">Ivan's Grades</h1><p className="page-subtitle">Academic performance by subject and term</p></div>
                    <button className="btn-secondary"><Download size={15} /> Download Report Card</button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {Object.keys(grades).map(t => (
                        <button key={t} onClick={() => setTerm(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${term === t ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="stat-card text-center border-l-4 border-blue-500"><p className="text-3xl font-bold text-primary-600">{avg}%</p><p className="text-xs text-gray-500 mt-1">Overall Average</p><div className="mt-1 flex justify-center"><Badge variant={gradeVariant(avg)}>{letterGrade(avg)}</Badge></div></div>
                    <div className="stat-card text-center border-l-4 border-emerald-500"><p className="text-3xl font-bold text-emerald-600">{Math.max(...Object.values(current))}%</p><p className="text-xs text-gray-500 mt-1">Best Subject</p><p className="text-xs text-gray-400">{Object.entries(current).sort((a, b) => b[1] - a[1])[0][0]}</p></div>
                    <div className="stat-card text-center border-l-4 border-purple-500"><p className="text-3xl font-bold text-gray-900">#3</p><p className="text-xs text-gray-500 mt-1">Class Rank</p><p className="text-xs text-gray-400">of 38 students</p></div>
                </div>

                <div className="card p-0">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Subject Breakdown — {term}</h2></div>
                    <table className="w-full">
                        <thead><tr>{['Subject', 'Teacher', 'Score', 'Grade', 'vs Previous Term', 'Remark'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {Object.entries(current).map(([subject, score]) => {
                                const prev = Object.values(grades)[1][subject]
                                const diff = score - prev
                                const teacherMap = { Mathematics: 'Mr. Okello', English: 'Ms. Nassali', Science: 'Mr. Byaruhanga', 'Social Studies': 'Ms. Acen', 'Religious Ed.': 'Mr. Waiswa' }
                                return (
                                    <tr key={subject} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-semibold">{subject}</td>
                                        <td className="table-cell text-sm text-gray-500">{teacherMap[subject]}</td>
                                        <td className="table-cell"><span className={`text-xl font-bold ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span></td>
                                        <td className="table-cell"><Badge variant={gradeVariant(score)}>{letterGrade(score)}</Badge></td>
                                        <td className="table-cell"><span className={`flex items-center gap-1 text-sm font-semibold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>{diff > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {diff > 0 ? '+' : ''}{diff}%</span></td>
                                        <td className="table-cell text-xs text-gray-500">{score >= 80 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs attention'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="card bg-blue-50 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Teacher's Comment — {term}</h3>
                    <p className="text-sm text-blue-800">"Ivan is a dedicated student who has shown remarkable improvement in Mathematics and Social Studies this term. He needs additional support in Science practical work. Overall, he is performing above the class average and is on track for promotion to P7."</p>
                    <p className="text-xs text-blue-500 mt-2">— Mr. Kenneth Okello, Class Teacher · Feb 2026</p>
                </div>
            </div>
        </DashboardLayout>
    )
}
