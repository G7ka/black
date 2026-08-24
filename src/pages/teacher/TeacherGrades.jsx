import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { Save, Download, Sparkles, CheckCircle2, BookOpen, Search } from 'lucide-react'

// Initial student assessment data for Teacher's assigned classes (P6A, P7B)
const initialStudents = [
    {
        id: 'PUP-001',
        name: 'Ivan Namukasa',
        class: 'P6A',
        midTerm: 46, // out of 50
        eot: 48,     // out of 50
        strand: 'Reads complex comprehension passages fluently and solves 3-digit multiplication word problems.',
        projectTitle: 'Model African Village Craft & Clay Pottery',
        projectScore: 9.5,
        remark: 'Outstanding pupil with high reading fluency and exemplary class participation.',
    },
    {
        id: 'PUP-002',
        name: 'Grace Mukasa',
        class: 'P6A',
        midTerm: 43,
        eot: 44,
        strand: 'Accurately computes fractions, decimals and understands environmental sanitation topics.',
        projectTitle: 'School Garden Vegetable Plot',
        projectScore: 9.0,
        remark: 'Very neat and consistent pupil. Demonstrates high curiosity in science practicals.',
    },
    {
        id: 'PUP-003',
        name: 'Moses Achola',
        class: 'P6A',
        midTerm: 35,
        eot: 37,
        strand: 'Grasping basic long division; shows good improvement in spelling and composition handwriting.',
        projectTitle: 'Papier-Mâché Globe Model',
        projectScore: 8.0,
        remark: 'Good effort throughout the term. Encouraged to read more library storybooks.',
    },
    {
        id: 'PUP-004',
        name: 'Esther Akello',
        class: 'P6A',
        midTerm: 48,
        eot: 49,
        strand: 'Exceeds expectations across mental sums, social studies map reading and grammar exercises.',
        projectTitle: 'Local Herbal Medicinal Garden Project',
        projectScore: 9.8,
        remark: 'Top performing pupil with brilliant analytical skills and exemplary moral character.',
    },
    {
        id: 'PUP-005',
        name: 'David Ouma',
        class: 'P7B',
        midTerm: 33,
        eot: 34,
        strand: 'Understands basic geometry angles; requires extra practice with multi-step word problems.',
        projectTitle: 'Clean Water Domestic Filter Craft',
        projectScore: 7.9,
        remark: 'Steady progress. Needs consistent revision in arithmetic operations.',
    },
    {
        id: 'PUP-006',
        name: 'Faith Ssali',
        class: 'P7B',
        midTerm: 45,
        eot: 46,
        strand: 'Consistently devises accurate solutions to algebraic equations and word problems.',
        projectTitle: 'Solar Cooker Demonstration Model',
        projectScore: 9.2,
        remark: 'Brilliant pupil with remarkable problem-solving speed and leadership.',
    },
    {
        id: 'PUP-007',
        name: 'Ruth Nabirye',
        class: 'P7B',
        midTerm: 44,
        eot: 45,
        strand: 'Demonstrates clear grasp of percentages, profit/loss arithmetic, and data graphs.',
        projectTitle: 'Recycled Plastic Bottle Planters',
        projectScore: 9.0,
        remark: 'Dedicated and diligent learner with high academic discipline.',
    },
    {
        id: 'PUP-008',
        name: 'Samuel Kato',
        class: 'P7B',
        midTerm: 26,
        eot: 28,
        strand: 'Gaining confidence in basic arithmetic; active in practical group assignments.',
        projectTitle: 'Woven Sisal Floor Mat',
        projectScore: 7.5,
        remark: 'Shows positive attitude in class. Encouraged to attend remedial math support.',
    }
]

// Preset quick comment descriptor suggestions
const presetRemarks = [
    'Outstanding pupil with high reading fluency and exemplary class participation.',
    'Exceeds expectations across all continuous assessment tasks and shows admirable curiosity.',
    'Consistently meets expected competencies with neat, well-organized workbook tasks.',
    'Steady progress observed; encouraged to practice daily reading and multiplication tables.',
    'Demonstrates excellent character, teamwork, and active interest in practical craft work.',
    'Active participant in group project investigations with strong practical leadership skills.'
]

const myClasses = ['All', 'P6A', 'P7B']
const mySubjects = ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies']

export default function TeacherGrades() {
    const [selectedClass, setSelectedClass] = useState('All')
    const [selectedSubject, setSelectedSubject] = useState('Mathematics')
    const [selectedTerm, setSelectedTerm] = useState('Term 1, 2026')
    const [searchQuery, setSearchQuery] = useState('')
    const [students, setStudents] = useState(initialStudents)
    const [activeEditStudent, setActiveEditStudent] = useState(null)
    const [toastMessage, setToastMessage] = useState(null)

    const triggerToast = (msg) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3500)
    }

    // Composite Total (Mid-Term 50% + EoT 50%)
    const calculateComposite = (mid, eot) => {
        const total = Math.round(Number(mid) + Number(eot))
        return Math.min(100, Math.max(0, total))
    }

    // Competency Descriptors (EE, ME, AE, BE)
    const calculateDescriptor = (total) => {
        if (total >= 80) return { code: 'EE', title: 'Exceeding Expectations (Level 4)', color: 'emerald' }
        if (total >= 65) return { code: 'ME', title: 'Meeting Expectations (Level 3)', color: 'blue' }
        if (total >= 50) return { code: 'AE', title: 'Approaching Expectations (Level 2)', color: 'amber' }
        return { code: 'BE', title: 'Below Expectations (Level 1)', color: 'red' }
    }

    const filteredStudents = students.filter(s => {
        const matchesClass = selectedClass === 'All' || s.class === selectedClass
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesClass && matchesSearch
    })

    const updateStudentField = (id, field, val) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s))
    }

    const handleSaveSingleModal = () => {
        if (!activeEditStudent) return
        setStudents(prev => prev.map(s => s.id === activeEditStudent.id ? activeEditStudent : s))
        setActiveEditStudent(null)
        triggerToast(`Assessment & remarks saved for ${activeEditStudent.name}! Synced to Academic Report.`)
    }

    const handleSaveAll = () => {
        triggerToast('All marks & qualitative descriptors saved successfully and synced to Academic Report Cards!')
    }

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Marks &amp; Competency Entry</h1>
                        <p className="page-subtitle">
                            Enter continuous assessments, exam marks, and qualitative remarks for your assigned classes.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => triggerToast('Exported class marksheet to Excel / CSV template!')}
                            className="btn-secondary"
                        >
                            <Download size={15} /> Export Marksheet
                        </button>
                        <button
                            onClick={handleSaveAll}
                            className="btn-primary flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                        >
                            <Save size={15} /> Save &amp; Sync to Reports
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                    {/* Class Filter */}
                    <div>
                        <label className="block text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                            My Assigned Class
                        </label>
                        <div className="flex gap-1.5">
                            {myClasses.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedClass(c)}
                                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all ${selectedClass === c ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subject Selector */}
                    <div>
                        <label className="block text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Subject</label>
                        <select
                            className="select-field text-xs font-semibold"
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                        >
                            {mySubjects.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Academic Term */}
                    <div>
                        <label className="block text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Academic Term</label>
                        <select
                            className="select-field text-xs font-semibold"
                            value={selectedTerm}
                            onChange={e => setSelectedTerm(e.target.value)}
                        >
                            {['Term 1, 2026', 'Term 3, 2025', 'Term 2, 2025'].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Student Search */}
                    <div>
                        <label className="block text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1 uppercase tracking-wider">Search Student</label>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search by name or ID..."
                                className="input-field pl-9 text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Marks & Assessment Sheet Table */}
                <div className="card p-0 overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                Class Assessment Sheet: <span className="text-primary-600 dark:text-primary-400 font-black">{selectedClass}</span> — {selectedSubject} ({selectedTerm})
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                Continuous Assessment (50%) + End of Term Exam (50%) = Total Composite 100%
                            </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
                            {filteredStudents.length} Students Enrolled
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold border-b border-gray-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-3">Student Name &amp; ID</th>
                                    <th className="p-3 text-center">Continuous Assessment<br/><span className="text-[10px] text-gray-400 font-normal">Score / 50 (50%)</span></th>
                                    <th className="p-3 text-center">End of Term Exam<br/><span className="text-[10px] text-gray-400 font-normal">Score / 50 (50%)</span></th>
                                    <th className="p-3 text-center">Total Score<br/><span className="text-[10px] text-gray-400 font-normal">Composite 100%</span></th>
                                    <th className="p-3 text-center">Competency Descriptor</th>
                                    <th className="p-3">Learning Strand Mastered</th>
                                    <th className="p-3">Teacher&apos;s Qualitative Remark</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                                {filteredStudents.map(s => {
                                    const total = calculateComposite(s.midTerm, s.eot)
                                    const desc = calculateDescriptor(total)

                                    return (
                                        <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="p-3">
                                                <p className="font-bold text-gray-900 dark:text-white">{s.name}</p>
                                                <p className="font-mono text-[10px] text-gray-500 dark:text-slate-400">{s.id} • {s.class}</p>
                                            </td>

                                            <td className="p-3 text-center">
                                                <div className="inline-flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="50"
                                                        value={s.midTerm}
                                                        onChange={e => updateStudentField(s.id, 'midTerm', e.target.value)}
                                                        className="w-14 text-center px-1.5 py-1 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary-500"
                                                    />
                                                    <span className="text-[10px] text-gray-400">/ 50</span>
                                                </div>
                                            </td>

                                            <td className="p-3 text-center">
                                                <div className="inline-flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="50"
                                                        value={s.eot}
                                                        onChange={e => updateStudentField(s.id, 'eot', e.target.value)}
                                                        className="w-14 text-center px-1.5 py-1 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold focus:ring-2 focus:ring-primary-500"
                                                    />
                                                    <span className="text-[10px] text-gray-400">/ 50</span>
                                                </div>
                                            </td>

                                            <td className="p-3 text-center">
                                                <span className="font-black text-sm text-gray-900 dark:text-white font-mono">
                                                    {total}%
                                                </span>
                                            </td>

                                            <td className="p-3 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${desc.code === 'EE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : desc.code === 'ME' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                                                    {desc.code} (L{desc.code === 'EE' ? '4' : desc.code === 'ME' ? '3' : '2'})
                                                </span>
                                            </td>

                                            <td className="p-3 max-w-xs truncate text-gray-600 dark:text-slate-300 text-[11px]">
                                                {s.strand}
                                            </td>

                                            <td className="p-3 max-w-xs truncate text-gray-500 dark:text-slate-400 italic text-[11px]">
                                                &ldquo;{s.remark}&rdquo;
                                            </td>

                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => setActiveEditStudent({ ...s })}
                                                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs transition-colors"
                                                >
                                                    Assess / Remark
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Summary Bar */}
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                        <Sparkles size={16} className="text-amber-500" />
                        <span>Marks and qualitative remarks entered here directly synchronize with the official Student Academic Report Cards.</span>
                    </div>
                    <button
                        onClick={handleSaveAll}
                        className="btn-primary flex items-center gap-1.5 shadow-sm"
                    >
                        <Save size={14} /> Save &amp; Sync Marksheet
                    </button>
                </div>

                {/* Detailed Assessment & Remarks Modal */}
                <Modal
                    isOpen={!!activeEditStudent}
                    onClose={() => setActiveEditStudent(null)}
                    title={`Assess & Remark: ${activeEditStudent?.name}`}
                    size="xl"
                    footer={
                        <div className="flex items-center justify-between w-full">
                            <button className="btn-secondary" onClick={() => setActiveEditStudent(null)}>Cancel</button>
                            <button
                                onClick={handleSaveSingleModal}
                                className="btn-primary flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                            >
                                <Save size={14} /> Save Assessment to Report
                            </button>
                        </div>
                    }
                >
                    {activeEditStudent && (
                        <div className="space-y-5 text-xs">
                            {/* Student Header */}
                            <div className="flex items-center justify-between p-3.5 bg-indigo-50 dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700">
                                <div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{activeEditStudent.name}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-slate-400">
                                        ID: {activeEditStudent.id} • Class: {activeEditStudent.class}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Composite</span>
                                    <p className="font-black text-lg text-indigo-600 dark:text-indigo-400">
                                        {calculateComposite(activeEditStudent.midTerm, activeEditStudent.eot)}%
                                    </p>
                                </div>
                            </div>

                            {/* Scores Input Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2">
                                    <label className="font-bold text-gray-900 dark:text-white block">
                                        Continuous Assessment (50%)
                                    </label>
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={activeEditStudent.midTerm}
                                            onChange={e => setActiveEditStudent({ ...activeEditStudent, midTerm: e.target.value })}
                                            className="input-field font-bold text-sm w-24 text-center"
                                        />
                                        <span className="text-gray-500 font-bold">/ 50 Marks</span>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-2">
                                    <label className="font-bold text-gray-900 dark:text-white block">
                                        End of Term Exam (50%)
                                    </label>
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={activeEditStudent.eot}
                                            onChange={e => setActiveEditStudent({ ...activeEditStudent, eot: e.target.value })}
                                            className="input-field font-bold text-sm w-24 text-center"
                                        />
                                        <span className="text-gray-500 font-bold">/ 50 Marks</span>
                                    </div>
                                </div>
                            </div>

                            {/* Specific Topic / Learning Strand Competency */}
                            <div className="space-y-1.5">
                                <label className="font-bold text-gray-900 dark:text-white block">
                                    Specific Learning Strand / Topic Competency Achieved
                                </label>
                                <input
                                    type="text"
                                    value={activeEditStudent.strand}
                                    onChange={e => setActiveEditStudent({ ...activeEditStudent, strand: e.target.value })}
                                    className="input-field text-xs"
                                    placeholder="Describe specific learning outcome mastered by learner..."
                                />
                            </div>

                            {/* Practical Project */}
                            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/40 space-y-2.5">
                                <label className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                    <BookOpen size={14} className="text-emerald-500" /> Practical Project Assessment
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">Project Title</label>
                                        <input
                                            type="text"
                                            value={activeEditStudent.projectTitle}
                                            onChange={e => setActiveEditStudent({ ...activeEditStudent, projectTitle: e.target.value })}
                                            className="input-field text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-semibold block mb-1">Score (/10.0)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={activeEditStudent.projectScore}
                                            onChange={e => setActiveEditStudent({ ...activeEditStudent, projectScore: e.target.value })}
                                            className="input-field text-xs text-center font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Qualitative Teacher Remarks */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="font-bold text-gray-900 dark:text-white block">
                                        Teacher&apos;s Qualitative Remarks (Directly appears on Report Card)
                                    </label>
                                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Quick Presets</span>
                                </div>

                                {/* Preset Remark Chips */}
                                <div className="flex flex-wrap gap-1.5 pb-1">
                                    {presetRemarks.map((qr, qi) => (
                                        <button
                                            key={qi}
                                            type="button"
                                            onClick={() => setActiveEditStudent({ ...activeEditStudent, remark: qr })}
                                            className="px-2.5 py-1 rounded-lg text-[10px] bg-gray-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition-colors text-left"
                                        >
                                            + {qr.substring(0, 42)}...
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    rows="3"
                                    value={activeEditStudent.remark}
                                    onChange={e => setActiveEditStudent({ ...activeEditStudent, remark: e.target.value })}
                                    className="input-field text-xs"
                                    placeholder="Enter qualitative descriptor for student..."
                                />
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-bounce">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>{toastMessage}</span>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}


