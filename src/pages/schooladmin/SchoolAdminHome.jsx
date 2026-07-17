import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Users, GraduationCap, DollarSign, TrendingUp, Plus, Upload, FileText, Bell, AlertCircle } from 'lucide-react'
import { studentsApi } from '../../api/students.api'
import { classesApi } from '../../api/classes.api'
import { attendanceApi, feesApi, schoolReportsApi, schoolConfigApi } from '../../api/schoolOps.api'

const CURRENT_TERM = 'Term 1 2026' // mirrors School Configuration → Terms until that page is wired to set this dynamically

export default function SchoolAdminHome({ role = 'schooladmin-primary' }) {
    const levelSegment = role.includes('secondary') ? 'secondary' : 'primary'
    const navigate = useNavigate()
    const [modal, setModal] = useState(null)

    const [school, setSchool] = useState(null)
    const [studentCount, setStudentCount] = useState(0)
    const [teacherCount, setTeacherCount] = useState(0)
    const [feeSummary, setFeeSummary] = useState(null)
    const [attendanceSummary, setAttendanceSummary] = useState(null)
    const [recentPayments, setRecentPayments] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const [enrollForm, setEnrollForm] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '', parentName: '', parentPhone: '', parentEmail: '' })
    const [enrollError, setEnrollError] = useState('')
    const [enrolling, setEnrolling] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const today = new Date().toISOString().slice(0, 10)
            const [students, config, report, attendance, payments, classList] = await Promise.all([
                studentsApi.list(),
                schoolConfigApi.get(),
                schoolReportsApi.overview(CURRENT_TERM),
                attendanceApi.overview(today),
                feesApi.listPaymentStatus(CURRENT_TERM),
                classesApi.list(),
            ])
            setStudentCount(students.length)
            setSchool(config)
            setTeacherCount(report.totalTeachers)
            setFeeSummary(report.feeCollection)
            setAttendanceSummary(attendance.summary)
            setRecentPayments(payments.filter(p => p.paid > 0).slice(0, 4))
            setClasses(classList)
        } catch (err) {
            setLoadError(err.message || 'Failed to load dashboard')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const submitEnroll = async () => {
        setEnrolling(true)
        setEnrollError('')
        try {
            await studentsApi.enroll(enrollForm)
            setModal(null)
            setEnrollForm({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '', parentName: '', parentPhone: '', parentEmail: '' })
            await load()
        } catch (err) {
            setEnrollError(err.message || 'Failed to enroll student')
        } finally {
            setEnrolling(false)
        }
    }

    return (
        <DashboardLayout role={role}>
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="page-title">School Dashboard</h1>
                        <p className="page-subtitle">{school?.name || 'Your School'} — {school?.currentTerm || CURRENT_TERM}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary" onClick={() => setModal('import')}><Upload size={15} /> Import Students</button>
                        <button className="btn-primary" onClick={() => { setModal('enroll'); setEnrollError('') }}><Plus size={15} /> Enroll Student</button>
                    </div>
                </div>

                {loadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {loadError}
                    </div>
                )}

                {loading ? (
                    <p className="text-sm text-gray-400">Loading dashboard…</p>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard title="Total Students" value={String(studentCount)} icon={GraduationCap} color="blue" />
                            <StatCard title="Teachers" value={String(teacherCount)} icon={Users} color="green" />
                            <StatCard title="Fees Collected" value={`UGX ${(feeSummary?.collected || 0).toLocaleString()}`} subtitle={`${feeSummary?.collectionRate || 0}% of expected`} icon={DollarSign} color="purple" />
                            <StatCard title="Attendance Rate" value={attendanceSummary?.overallRate || '—'} subtitle="Today" icon={TrendingUp} color="amber" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="card">
                                <h2 className="section-title">Recent Payments</h2>
                                <div className="overflow-x-auto"><table className="w-full">
                                    <thead><tr>{['Parent', 'Student', 'Amount', 'Status'].map(h => <th key={h} className="table-header text-xs">{h}</th>)}</tr></thead>
                                    <tbody>
                                        {recentPayments.map((p, i) => (
                                            <tr key={i} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30">
                                                <td className="table-cell text-sm font-medium dark:text-white">{p.parent}</td>
                                                <td className="table-cell text-sm text-gray-500 dark:text-slate-400">{p.studentName}</td>
                                                <td className="table-cell text-sm dark:text-slate-300">UGX {p.paid.toLocaleString()}</td>
                                                <td className="table-cell"><Badge variant={p.status === 'PAID' ? 'success' : p.status === 'PARTIAL' ? 'warning' : 'danger'}>{p.status.toLowerCase()}</Badge></td>
                                            </tr>
                                        ))}
                                        {recentPayments.length === 0 && (
                                            <tr><td colSpan={4} className="table-cell text-center text-gray-400 py-6">No payments recorded yet for {CURRENT_TERM}.</td></tr>
                                        )}
                                    </tbody>
                                </table></div>
                            </div>
                            <div className="card">
                                <h2 className="section-title">Quick Actions</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Fee Reminders', icon: Bell, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800', path: `/schooladmin/${levelSegment}/fees` },
                                        { label: 'View Reports', icon: FileText, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800', path: `/schooladmin/${levelSegment}/reports` },
                                        { label: 'Attendance', icon: AlertCircle, color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800', path: `/schooladmin/${levelSegment}/attendance` },
                                        { label: 'Add Teacher', icon: Plus, color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', path: `/schooladmin/${levelSegment}/teachers` },
                                    ].map(a => (
                                        <button key={a.label} onClick={() => navigate(a.path)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all hover:shadow-md ${a.color} dark:shadow-none`}>
                                            <a.icon size={22} />{a.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Modal isOpen={modal === 'enroll'} onClose={() => setModal(null)} title="Enroll New Student" size="lg"
                footer={<><button className="btn-secondary" onClick={() => setModal(null)}>Cancel</button><button disabled={enrolling} className="btn-primary" onClick={submitEnroll}><GraduationCap size={14} /> {enrolling ? 'Enrolling…' : 'Enroll Student'}</button></>}>
                <div className="space-y-4">
                    {enrollError && <p className="text-sm text-red-600">{enrollError}</p>}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">First Name</label>
                            <input className="input-field" placeholder="John" value={enrollForm.firstName} onChange={e => setEnrollForm(f => ({ ...f, firstName: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Last Name</label>
                            <input className="input-field" placeholder="Doe" value={enrollForm.lastName} onChange={e => setEnrollForm(f => ({ ...f, lastName: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Date of Birth</label>
                            <input type="date" className="input-field" value={enrollForm.dateOfBirth} onChange={e => setEnrollForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Gender</label>
                            <select className="select-field" value={enrollForm.gender} onChange={e => setEnrollForm(f => ({ ...f, gender: e.target.value }))}>
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Class</label>
                            <select className="select-field" value={enrollForm.classId} onChange={e => setEnrollForm(f => ({ ...f, classId: e.target.value }))}>
                                <option value="">Select class</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Parent Name</label>
                            <input className="input-field" value={enrollForm.parentName} onChange={e => setEnrollForm(f => ({ ...f, parentName: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Parent Phone</label>
                            <input type="tel" className="input-field" placeholder="+256 700 000000" value={enrollForm.parentPhone} onChange={e => setEnrollForm(f => ({ ...f, parentPhone: e.target.value }))} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Parent Email</label>
                            <input type="email" className="input-field" value={enrollForm.parentEmail} onChange={e => setEnrollForm(f => ({ ...f, parentEmail: e.target.value }))} />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modal === 'import'} onClose={() => setModal(null)} title="Import Students from Excel"
                footer={<button className="btn-secondary" onClick={() => setModal(null)}>Close</button>}>
                <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                        Bulk Excel/CSV import isn't wired up yet — there's no file-parsing pipeline behind this button. Use "Enroll Student" for now, or ask to have this built as its own task.
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
