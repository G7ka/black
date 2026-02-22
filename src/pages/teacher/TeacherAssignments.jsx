import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Plus, Edit2, Eye, Calendar, Users, CheckSquare, FileText, Paperclip } from 'lucide-react'

const assignments = [
    { id: 1, title: 'Fractions & Decimals Worksheet', class: 'P6A', dueDate: '2026-02-24', status: 'active', submitted: 28, total: 38, description: 'Complete exercises 4.1 to 4.8 on fractions and decimal conversions.' },
    { id: 2, title: 'Algebra Introduction — Chapter 7', class: 'P7B', dueDate: '2026-02-26', status: 'active', submitted: 15, total: 40, description: 'Read Chapter 7 and solve all example problems.' },
    { id: 3, title: 'Mental Math Test 3', class: 'P6A', dueDate: '2026-02-20', status: 'completed', submitted: 38, total: 38, description: '30-minute timed mental math assessment.' },
    { id: 4, title: 'Geometry Shapes — Project', class: 'P7B', dueDate: '2026-03-05', status: 'draft', submitted: 0, total: 40, description: 'Create a poster showing 10 geometric shapes with properties.' },
]

const submitters = [
    { name: 'Ivan Namukasa', submitted: true, date: '2026-02-23', grade: null },
    { name: 'Grace Mukasa', submitted: true, date: '2026-02-22', grade: 88 },
    { name: 'Moses Achola', submitted: false, date: null, grade: null },
    { name: 'Esther Akello', submitted: true, date: '2026-02-23', grade: null },
    { name: 'Brian Mwesige', submitted: false, date: null, grade: null },
]

export default function TeacherAssignments() {
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)

    const open = (type, a) => { setSelected(a); setModal(type) }

    return (
        <DashboardLayout role="teacher">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">Assignments</h1><p className="page-subtitle">Create and track assignments for your classes</p></div>
                    <button className="btn-primary" onClick={() => setModal('create')}><Plus size={15} /> New Assignment</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[{ label: 'Active', count: 2, color: 'blue' }, { label: 'Completed', count: 1, color: 'green' }, { label: 'Draft', count: 1, color: 'gray' }, { label: 'Ungraded', count: 3, color: 'amber' }].map(s => (
                        <div key={s.label} className={`stat-card border-l-4 ${s.color === 'blue' ? 'border-blue-500' : s.color === 'green' ? 'border-emerald-500' : s.color === 'amber' ? 'border-amber-500' : 'border-gray-300'}`}>
                            <p className="text-2xl font-bold text-gray-900">{s.count}</p>
                            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    {assignments.map(a => (
                        <div key={a.id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="text-base font-bold text-gray-900">{a.title}</h3>
                                        <Badge variant={a.status === 'active' ? 'info' : a.status === 'completed' ? 'success' : 'gray'}>{a.status}</Badge>
                                        <Badge variant="purple">{a.class}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{a.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> Due: {a.dueDate}</span>
                                        <span className="flex items-center gap-1"><Users size={12} /> {a.submitted}/{a.total} submitted</span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-xs"><div className={`h-1.5 rounded-full ${a.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${(a.submitted / a.total) * 100}%` }} /></div>
                                        <span className="text-xs text-gray-500">{Math.round((a.submitted / a.total) * 100)}%</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => open('view', a)} className="btn-secondary text-xs py-1.5"><Eye size={12} /> Submissions</button>
                                    <button onClick={() => open('edit', a)} className="btn-primary text-xs py-1.5"><Edit2 size={12} /> Edit</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal isOpen={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'create' ? 'New Assignment' : `Edit — ${selected?.title}`} size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button className="btn-primary" onClick={() => setModal(null)}><CheckSquare size={14} /> {modal === 'create' ? 'Create' : 'Save Changes'}</button></>}>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input className="input-field" defaultValue={selected?.title} placeholder="e.g., Chapter 5 Worksheet" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Class</label><select className="select-field"><option>P6A</option><option>P7B</option><option>Both</option></select></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input type="date" className="input-field" defaultValue={selected?.dueDate} /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Description / Instructions</label><textarea className="input-field resize-none" rows={4} defaultValue={selected?.description} placeholder="Describe the assignment..." /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="select-field" defaultValue={selected?.status}><option value="draft">Draft</option><option value="active">Active (Publish)</option></select>
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary-300 transition-colors">
                        <Paperclip size={18} className="mx-auto text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Attach file (PDF, DOC, image)</p>
                    </div>
                </div>
            </Modal>

            {/* Submissions Modal */}
            <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={`Submissions — ${selected?.title}`} size="lg"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                <div className="space-y-2">
                    {submitters.map((s, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${s.submitted ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.submitted ? 'bg-emerald-500' : 'bg-red-400'}`}>{s.name[0]}</div>
                                <div><p className="text-sm font-medium text-gray-900">{s.name}</p><p className="text-xs text-gray-400">{s.submitted ? `Submitted ${s.date}` : 'Not submitted'}</p></div>
                            </div>
                            <div className="flex items-center gap-2">
                                {s.submitted && (
                                    s.grade ? <span className="text-sm font-bold text-emerald-700">{s.grade}/100</span>
                                        : <input type="number" placeholder="Grade" className="w-20 text-center px-2 py-1 border border-gray-200 rounded-lg text-sm" />
                                )}
                                {s.submitted && <button className="btn-secondary text-xs py-1 px-2"><Eye size={11} /> View</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </DashboardLayout>
    )
}
