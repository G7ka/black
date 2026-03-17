import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, CheckCircle, XCircle, Pause, Trash2, LogIn, FileText, Upload, Edit3, DollarSign } from 'lucide-react'

const PRICE_PER_STUDENT = 2000 // UGX per student per month

const schools = [
    { id: 1, name: 'Greenhill Academy', level: 'Primary', location: 'Kampala', physicalAddress: 'Plot 12, Makerere Hill Rd', district: 'Kampala', students: 1240, teachers: 58, subdomain: 'greenhill', status: 'active', payment: 'paid', contactName: 'Dr. Monica Nsereko', contactPhone: '+256 701 234567', contactEmail: 'admin@greenhill.ac.ug', licenseFile: 'greenhill_moes_license.pdf' },
    { id: 2, name: 'St. Mary\'s College', level: 'Secondary', location: 'Wakiso', physicalAddress: '45 Entebbe Rd, Nsangi', district: 'Wakiso', students: 890, teachers: 42, subdomain: 'stmarys', status: 'active', payment: 'overdue', contactName: 'Fr. Joseph Kizza', contactPhone: '+256 772 345678', contactEmail: 'info@stmarys.ug', licenseFile: 'stmarys_license.pdf' },
    { id: 3, name: 'Kabale Primary School', level: 'Primary', location: 'Kabale', physicalAddress: 'Kabale Town Centre', district: 'Kabale', students: 430, teachers: 18, subdomain: 'kabale-ps', status: 'pending', payment: 'pending', contactName: 'Mary Tumushabe', contactPhone: '+256 780 456789', contactEmail: 'mary@kabaleps.ug', licenseFile: 'kabale_ps_license.pdf' },
    { id: 4, name: 'Nile International School', level: 'Secondary', location: 'Jinja', physicalAddress: '8 Nile Ave, Jinja', district: 'Jinja', students: 720, teachers: 35, subdomain: 'nile-int', status: 'active', payment: 'paid', contactName: 'Robert Waiswa', contactPhone: '+256 755 567890', contactEmail: 'admin@nileint.ug', licenseFile: 'nile_int_license.pdf' },
    { id: 5, name: 'Buganda Road Primary', level: 'Primary', location: 'Kampala', physicalAddress: 'Buganda Rd, Kampala', district: 'Kampala', students: 560, teachers: 24, subdomain: 'buganda-ps', status: 'suspended', payment: 'overdue', contactName: 'Alice Namugga', contactPhone: '+256 700 678901', contactEmail: 'alice@bugandaps.ug', licenseFile: 'buganda_license.pdf' },
    { id: 6, name: 'Aga Khan School', level: 'Primary', location: 'Kampala', physicalAddress: '24 Buganda Rd', district: 'Kampala', students: 980, teachers: 47, subdomain: 'agakhan', status: 'active', payment: 'paid', contactName: 'Fatma Hassan', contactPhone: '+256 713 789012', contactEmail: 'fatma@agakhan.ug', licenseFile: 'agakhan_license.pdf' },
    { id: 7, name: 'Mbarara High School', level: 'Secondary', location: 'Mbarara', physicalAddress: 'High St, Mbarara', district: 'Mbarara', students: 630, teachers: 29, subdomain: 'mbarara-hs', status: 'pending', payment: 'pending', contactName: 'David Asiimwe', contactPhone: '+256 782 890123', contactEmail: 'david@mbararahs.ug', licenseFile: 'mbarara_hs_license.pdf' },
    { id: 8, name: 'Gulu Excellence School', level: 'Primary', location: 'Gulu', physicalAddress: 'Gulu Central', district: 'Gulu', students: 340, teachers: 15, subdomain: 'gulu-excl', status: 'active', payment: 'paid', contactName: 'Grace Acen', contactPhone: '+256 770 901234', contactEmail: 'grace@guluexcl.ug', licenseFile: 'gulu_license.pdf' },
]

const statusVariant = { active: 'success', pending: 'warning', suspended: 'danger' }
const paymentVariant = { paid: 'success', overdue: 'danger', pending: 'warning' }
const levelVariant = { Primary: 'sky', Secondary: 'indigo' }

export default function SASchools() {
    const [filter, setFilter] = useState('all')
    const [levelFilter, setLevelFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(null)
    const [selected, setSelected] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [newSchoolStudents, setNewSchoolStudents] = useState('')

    const filtered = schools.filter(s => {
        const matchStatus = filter === 'all' || s.status === filter
        const matchLevel = levelFilter === 'all' || s.level === levelFilter
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.location.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchLevel && matchSearch
    })

    const openModal = (type, school) => { setModal(type); setSelected(school) }
    const closeModal = () => { setModal(null); setSelected(null); setRejectReason(''); setNewSchoolStudents('') }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Schools Management</h1>
                        <p className="page-subtitle">Manage all registered schools on the platform</p>
                    </div>
                    <button className="btn-primary" onClick={() => setModal('add')}>
                        <Plus size={16} /> Add School
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 w-full">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                        {['all', 'active', 'pending', 'suspended'].map(t => (
                            <button key={t} onClick={() => setFilter(t)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                                {t} {t !== 'all' && <span className="ml-1 text-xs opacity-70">({schools.filter(s => s.status === t).length})</span>}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-1 hidden sm:block"></div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                        {['all', 'Primary', 'Secondary'].map(l => (
                            <button key={l} onClick={() => setLevelFilter(l)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${levelFilter === l ? 'bg-slate-700 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                                {l === 'all' ? 'All Levels' : l}
                            </button>
                        ))}
                    </div>
                    <div className="sm:ml-auto relative w-full sm:w-auto mt-2 sm:mt-0">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools..." className="input-field pl-9 w-full sm:w-64" />
                    </div>
                </div>

                {/* Table */}
                <div className="card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['School Name', 'Level', 'Location', 'Students', 'Monthly Bill', 'Contact', 'Subdomain', 'Status', 'Payment', 'Actions'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="table-cell font-semibold text-gray-900 dark:text-white">{s.name}</td>
                                        <td className="table-cell"><Badge variant={levelVariant[s.level]}>{s.level}</Badge></td>
                                        <td className="table-cell text-gray-500 dark:text-slate-400">{s.location}</td>
                                        <td className="table-cell">{s.students.toLocaleString()}</td>
                                        <td className="table-cell font-semibold text-blue-700 dark:text-blue-400">UGX {(s.students * PRICE_PER_STUDENT).toLocaleString()}</td>
                                        <td className="table-cell text-xs text-gray-500 dark:text-slate-400">{s.contactName}</td>
                                        <td className="table-cell">
                                            <code className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-blue-700 dark:text-blue-400">{s.subdomain}.edumanage.ug</code>
                                        </td>
                                        <td className="table-cell">
                                            <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                                        </td>
                                        <td className="table-cell">
                                            <Badge variant={paymentVariant[s.payment]}>{s.payment}</Badge>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openModal('view', s)} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400" title="View">
                                                    <Eye size={14} />
                                                </button>
                                                {s.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => openModal('approve', s)} className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600" title="Approve">
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button onClick={() => openModal('reject', s)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600" title="Reject">
                                                            <XCircle size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {s.status === 'active' && (
                                                    <button onClick={() => openModal('suspend', s)} className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600" title="Suspend">
                                                        <Pause size={14} />
                                                    </button>
                                                )}
                                                <button onClick={() => openModal('login', s)} className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 text-violet-600" title="Login as Admin">
                                                    <LogIn size={14} />
                                                </button>
                                                <button onClick={() => openModal('delete', s)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400 dark:text-slate-500">No schools found matching the criteria.</div>
                    )}
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl">
                        <p className="text-xs text-gray-500 dark:text-slate-400">Showing {filtered.length} of {schools.length} schools</p>
                        <div className="flex gap-2">
                            <button className="btn-secondary text-xs py-1 px-3">Previous</button>
                            <button className="btn-primary text-xs py-1 px-3">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <Modal isOpen={modal === 'approve'} onClose={closeModal} title="Approve School Application"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-success" onClick={closeModal}><CheckCircle size={14} /> Approve School</button></>}
            >
                <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">{selected?.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{selected?.location} · {selected?.subdomain}.edumanage.ug</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300">Approving this school will:
                        <ul className="list-disc ml-5 mt-1 space-y-1 text-xs text-gray-500 dark:text-slate-400">
                            <li>Activate their account & subdomain</li>
                            <li>Send welcome email with login credentials</li>
                            <li>Start their subscription billing cycle</li>
                        </ul>
                    </p>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal isOpen={modal === 'reject'} onClose={closeModal} title="Reject Application"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-danger" onClick={closeModal}><XCircle size={14} /> Reject</button></>}
            >
                <div className="space-y-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">{selected?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Reason for Rejection *</label>
                        <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} className="input-field resize-none"
                            placeholder="Provide a reason that will be emailed to the applicant..." />
                    </div>
                </div>
            </Modal>

            {/* Suspend Modal */}
            <Modal isOpen={modal === 'suspend'} onClose={closeModal} title="Suspend School"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-danger" onClick={closeModal}><Pause size={14} /> Suspend School</button></>}
            >
                <p className="text-sm text-gray-600 dark:text-slate-300">Are you sure you want to suspend <strong>{selected?.name}</strong>? Their students and teachers will lose access immediately.</p>
            </Modal>

            {/* Login-as Modal */}
            <Modal isOpen={modal === 'login'} onClose={closeModal} title="Login as School Admin"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-primary" onClick={() => { closeModal(); window.location.href = '/schooladmin'; }}><LogIn size={14} /> Enter School Portal</button></>}
            >
                <p className="text-sm text-gray-600 dark:text-slate-300">You are about to impersonate <strong>{selected?.name}</strong> as their School Admin. All actions will be logged for audit.</p>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete School"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-danger" onClick={closeModal}><Trash2 size={14} /> Permanently Delete</button></>}
            >
                <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">⚠ This action is irreversible</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300">Deleting <strong>{selected?.name}</strong> will permanently remove all data including students, grades, attendance records, and payment history.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Type school name to confirm</label>
                        <input className="input-field" placeholder={selected?.name} />
                    </div>
                </div>
            </Modal>

            {/* View School Modal — Shows all registration data */}
            <Modal isOpen={modal === 'view'} onClose={closeModal} title="School Details" size="lg"
                footer={<button className="btn-secondary" onClick={closeModal}>Close</button>}
            >
                {selected && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            {[
                                ['School Name', selected.name], ['Level', selected.level],
                                ['Location', selected.location], ['Physical Address', selected.physicalAddress],
                                ['District', selected.district], ['Number of Students', selected.students],
                                ['Number of Teachers', selected.teachers],
                                ['Subdomain', `${selected.subdomain}.edumanage.ug`],
                                ['Monthly Bill', `UGX ${(selected.students * PRICE_PER_STUDENT).toLocaleString()}`],
                                ['Status', selected.status], ['Payment', selected.payment],
                            ].map(([k, v]) => (
                                <div key={k} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{k}</p>
                                    <p className="text-gray-900 dark:text-white font-semibold mt-0.5 capitalize">{v}</p>
                                </div>
                            ))}
                        </div>

                        {/* Billing Breakdown */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">Billing Breakdown</h3>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Students</span><span className="font-semibold dark:text-white">{selected.students.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600 dark:text-slate-400">Rate per student</span><span className="font-semibold dark:text-white">UGX {PRICE_PER_STUDENT.toLocaleString()}/mo</span></div>
                                <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2 mt-1"><span className="font-bold text-gray-800 dark:text-slate-200">Total Monthly Bill</span><span className="font-extrabold text-blue-700 dark:text-blue-400 text-base">UGX {(selected.students * PRICE_PER_STUDENT).toLocaleString()}</span></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">Contact Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                {[
                                    ['Contact Person', selected.contactName],
                                    ['Phone Number', selected.contactPhone],
                                    ['Email Address', selected.contactEmail],
                                ].map(([k, v]) => (
                                    <div key={k} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                        <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">{k}</p>
                                        <p className="text-gray-900 dark:text-white font-semibold mt-0.5">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2">Documents</h3>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <FileText size={18} className="text-primary-600 dark:text-blue-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">MoES License</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">{selected.licenseFile}</p>
                                </div>
                                <button onClick={() => openModal('viewDoc', selected)} className="btn-secondary text-xs py-1 px-3"><Eye size={11} /> View</button>
                                <button onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = selected.licenseFile; a.click(); alert(`Downloading ${selected.licenseFile}...`) }} className="btn-primary text-xs py-1 px-3"><FileText size={11} /> Download</button>
                            </div>
                        </div>

                        {/* Request School Name Change */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2 flex items-center gap-2"><Edit3 size={14} className="text-amber-500" /> Update School Name</h3>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3">
                                <p className="text-xs text-amber-700 dark:text-amber-400">A school can request a name change by providing legal documentation. Upload the new legal doc and enter the updated name below.</p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">New School Name</label>
                                    <input type="text" placeholder={selected.name} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Supporting Legal Document (PDF)</label>
                                    <div className="border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl p-4 text-center hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer">
                                        <Upload size={20} className="mx-auto text-amber-400 dark:text-amber-500 mb-1" />
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Click to upload legal document (PDF only)</p>
                                    </div>
                                </div>
                                <button className="btn-primary text-xs py-2 px-4"><Edit3 size={12} /> Update Name</button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add School Modal — matches SchoolRegistration fields */}
            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Register New School" size="lg"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-primary" onClick={closeModal}><Plus size={14} /> Register School</button></>}
            >
                <div className="space-y-5">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3">School Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">School Name *</label>
                                <input type="text" placeholder="e.g., Greenhill Academy" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">School Level *</label>
                                <select className="select-field">
                                    <option value="Primary">Primary</option>
                                    <option value="Secondary">Secondary</option>
                                    <option value="Both">Both (Primary & Secondary)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">District *</label>
                                <input type="text" placeholder="e.g., Kampala" className="input-field" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Physical Address *</label>
                                <input type="text" placeholder="e.g., Plot 12, Makerere Hill Rd" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Number of Students</label>
                                <input type="number" placeholder="e.g., 500" className="input-field" value={newSchoolStudents} onChange={e => setNewSchoolStudents(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contact Person *</label>
                                <input type="text" placeholder="Full name" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Phone Number *</label>
                                <input type="tel" placeholder="+256 700 000000" className="input-field" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email Address *</label>
                                <input type="email" placeholder="admin@school.ug" className="input-field" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3">Portal & Documents</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subdomain *</label>
                                <input type="text" placeholder="greenhill" className="input-field" />
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Will be: subdomain.edumanage.ug</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Billing</label>
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-600 dark:text-slate-400">Total Monthly Bill:</span>
                                        <span className="font-bold text-blue-700 dark:text-blue-400 text-base">
                                            UGX {newSchoolStudents ? (Number(newSchoolStudents) * PRICE_PER_STUDENT).toLocaleString() : '0'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 dark:text-slate-400">Based on UGX {PRICE_PER_STUDENT.toLocaleString()} per student.</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">MoES License (Document Upload)</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                                    <Upload size={24} className="mx-auto text-gray-400 dark:text-slate-500 mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-slate-400">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* View Document Modal */}
            <Modal isOpen={modal === 'viewDoc'} onClose={closeModal} title="Document Preview" size="lg"
                footer={<><button className="btn-secondary" onClick={closeModal}>Close</button><button className="btn-primary" onClick={() => { alert(`Downloading ${selected?.licenseFile}...`); }}><FileText size={14} /> Download File</button></>}
            >
                {selected && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                            <FileText size={20} className="text-primary-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{selected.licenseFile}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">MoES License · Uploaded during registration</p>
                            </div>
                        </div>
                        <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 min-h-[350px] flex flex-col items-center justify-center">
                            <div className="text-center p-8">
                                <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                    <FileText size={36} className="text-blue-500 dark:text-blue-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{selected.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">MoES Registration License</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500">{selected.licenseFile} · PDF Document</p>
                                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                                    <span>School: <strong className="text-gray-700 dark:text-slate-300">{selected.name}</strong></span>
                                    <span>•</span>
                                    <span>District: <strong className="text-gray-700 dark:text-slate-300">{selected.district}</strong></span>
                                    <span>•</span>
                                    <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">Verified</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    )
}
