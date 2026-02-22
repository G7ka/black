import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { BarChart } from '../../components/charts/Charts'
import { Download, Award, TrendingUp, TrendingDown } from 'lucide-react'

const grades = {
    'Term 1, 2026': { Mathematics: 88, English: 82, Science: 75, 'Social Studies': 91, 'Religious Ed.': 79 },
    'Term 2, 2025': { Mathematics: 80, English: 79, Science: 70, 'Social Studies': 85, 'Religious Ed.': 76 },
    'Term 1, 2025': { Mathematics: 74, English: 72, Science: 65, 'Social Studies': 80, 'Religious Ed.': 70 },
}

const letterGrade = (s) => s >= 90 ? 'A' : s >= 80 ? 'B+' : s >= 70 ? 'B' : s >= 60 ? 'C' : 'D'
const gradeColor = (s) => s >= 80 ? 'success' : s >= 60 ? 'warning' : 'danger'

export default function StudentGrades() {
    const [term, setTerm] = useState('Term 1, 2026')
    const current = grades[term]
    const avg = Math.round(Object.values(current).reduce((a, b) => a + b, 0) / Object.keys(current).length)

    const chartData = {
        labels: Object.keys(current),
        datasets: [{ label: 'Score (%)', data: Object.values(current), backgroundColor: Object.values(current).map(v => v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444'), borderRadius: 8 }],
    }

    return (
        <DashboardLayout role="student">
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div><h1 className="page-title">My Grades</h1><p className="page-subtitle">Academic performance by subject and term</p></div>
                    <button className="btn-secondary"><Download size={15} /> Download Report Card</button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {Object.keys(grades).map(t => (
                        <button key={t} onClick={() => setTerm(t)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${term === t ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="stat-card text-center"><p className="text-3xl font-bold text-primary-600">{avg}%</p><p className="text-xs text-gray-500 mt-1">Overall Average</p><div className="mt-2 flex justify-center"><Badge variant={gradeColor(avg)}>{letterGrade(avg)}</Badge></div></div>
                    <div className="stat-card text-center"><p className="text-3xl font-bold text-emerald-600">{Math.max(...Object.values(current))}%</p><p className="text-xs text-gray-500 mt-1">Highest Subject</p><p className="text-xs text-gray-400">{Object.entries(current).sort((a, b) => b[1] - a[1])[0][0]}</p></div>
                    <div className="stat-card text-center"><p className="text-3xl font-bold text-amber-600">{Math.min(...Object.values(current))}%</p><p className="text-xs text-gray-500 mt-1">Needs Improvement</p><p className="text-xs text-gray-400">{Object.entries(current).sort((a, b) => a[1] - b[1])[0][0]}</p></div>
                </div>

                <div className="card"><h2 className="section-title">Subject Scores — {term}</h2><BarChart data={chartData} options={{ scales: { y: { min: 0, max: 100 } } }} /></div>

                <div className="card p-0">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-semibold text-gray-800">Detailed Breakdown</h2></div>
                    <table className="w-full">
                        <thead><tr>{['Subject', 'Score', 'Grade', 'Status', 'vs Last Term'].map(h => <th key={h} className="table-header">{h}</th>)}</tr></thead>
                        <tbody>
                            {Object.entries(current).map(([subject, score]) => {
                                const prev = Object.values(grades)[1]?.[subject] ?? score
                                const diff = score - prev
                                return (
                                    <tr key={subject} className="hover:bg-blue-50/30">
                                        <td className="table-cell font-semibold">{subject}</td>
                                        <td className="table-cell"><span className={`text-lg font-bold ${gradeColor(score) === 'success' ? 'text-emerald-600' : gradeColor(score) === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span></td>
                                        <td className="table-cell"><Badge variant={gradeColor(score)}>{letterGrade(score)}</Badge></td>
                                        <td className="table-cell"><Badge variant={score >= 70 ? 'success' : 'warning'}>{score >= 70 ? 'Pass' : 'Improve'}</Badge></td>
                                        <td className="table-cell">
                                            <span className={`flex items-center gap-1 text-sm font-semibold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {diff > 0 ? <TrendingUp size={13} /> : diff < 0 ? <TrendingDown size={13} /> : '—'}
                                                {diff !== 0 ? `${diff > 0 ? '+' : ''}${diff}%` : 'Same'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    )
}
