import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { Search, Plus, Eye, CheckCircle, XCircle, Pause, Trash2, LogIn, Filter, ChevronDown } from 'lucide-react'

const schools = [
    { id: 1, name: 'Greenhill Academy', level: 'Primary', location: 'Kampala', students: 1240, teachers: 58, subdomain: 'greenhill', plan: 'Pro', status: 'active', payment: 'paid' },
    { id: 2, name: 'St. Mary\'s College', level: 'Secondary', location: 'Wakiso', students: 890, teachers: 42, subdomain: 'stmarys', plan: 'Basic', status: 'active', payment: 'overdue' },
    { id: 3, name: 'Kabale Primary School', level: 'Primary', location: 'Kabale', students: 430, teachers: 18, subdomain: 'kabale-ps', plan: 'Basic', status: 'pending', payment: 'pending' },
    { id: 4, name: 'Nile International School', level: 'Secondary', location: 'Jinja', students: 720, teachers: 35, subdomain: 'nile-int', plan: 'Enterprise', status: 'active', payment: 'paid' },
    { id: 5, name: 'Buganda Road Primary', level: 'Primary', location: 'Kampala', students: 560, teachers: 24, subdomain: 'buganda-ps', plan: 'Basic', status: 'suspended', payment: 'overdue' },
    { id: 6, name: 'Aga Khan School', level: 'Primary', location: 'Kampala', students: 980, teachers: 47, subdomain: 'agakhan', plan: 'Pro', status: 'active', payment: 'paid' },
    { id: 7, name: 'Mbarara High School', level: 'Secondary', location: 'Mbarara', students: 630, teachers: 29, subdomain: 'mbarara-hs', plan: 'Basic', status: 'pending', payment: 'pending' },
    { id: 8, name: 'Gulu Excellence School', level: 'Primary', location: 'Gulu', students: 340, teachers: 15, subdomain: 'gulu-excl', plan: 'Basic', status: 'active', payment: 'paid' },
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

    const filtered = schools.filter(s => {
        const matchStatus = filter === 'all' || s.status === filter
        const matchLevel = levelFilter === 'all' || s.level === levelFilter
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.location.toLowerCase().includes(search.toLowerCase())
        return matchStatus && matchLevel && matchSearch
    })

    const openModal = (type, school) => { setModal(type); setSelected(school) }
    const closeModal = () => { setModal(null); setSelected(null); setRejectReason('') }

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
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'active', 'pending', 'suspended'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filter === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {t} {t !== 'all' && <span className="ml-1 text-xs opacity-70">({schools.filter(s => s.status === t).length})</span>}
                        </button>
                    ))}
                    <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
                    {['all', 'Primary', 'Secondary'].map(l => (
                        <button
                            key={l}
                            onClick={() => setLevelFilter(l)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${levelFilter === l ? 'bg-slate-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {l === 'all' ? 'All Levels' : l}
                        </button>
                    ))}
                    <div className="ml-auto relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search schools..."
                            className="input-field pl-9 w-64"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['School Name', 'Level', 'Location', 'Students', 'Teachers', 'Subdomain', 'Plan', 'Status', 'Payment', 'Actions'].map(h => (
                                        <th key={h} className="table-header">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="table-cell font-semibold text-gray-900">{s.name}</td>
                                        <td className="table-cell"><Badge variant={levelVariant[s.level]}>{s.level}</Badge></td>
                                        <td className="table-cell text-gray-500">{s.location}</td>
                                        <td className="table-cell">{s.students.toLocaleString()}</td>
                                        <td className="table-cell">{s.teachers}</td>
                                        <td className="table-cell">
                                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-blue-700">{s.subdomain}.edumanage.ug</code>
                                        </td>
                                        <td className="table-cell">
                                            <Badge variant={s.plan === 'Enterprise' ? 'purple' : s.plan === 'Pro' ? 'info' : 'gray'}>{s.plan}</Badge>
                                        </td>
                                        <td className="table-cell">
                                            <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                                        </td>
                                        <td className="table-cell">
                                            <Badge variant={paymentVariant[s.payment]}>{s.payment}</Badge>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openModal('view', s)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" title="View">
                                                    <Eye size={14} />
                                                </button>
                                                {s.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => openModal('approve', s)} className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600" title="Approve">
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button onClick={() => openModal('reject', s)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600" title="Reject">
                                                            <XCircle size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {s.status === 'active' && (
                                                    <button onClick={() => openModal('suspend', s)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600" title="Suspend">
                                                        <Pause size={14} />
                                                    </button>
                                                )}
                                                <button onClick={() => openModal('login', s)} className="p-1.5 rounded-lg hover:bg-violet-100 text-violet-600" title="Login as Admin">
                                                    <LogIn size={14} />
                                                </button>
                                                <button onClick={() => openModal('delete', s)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-12 text-center text-gray-400">No schools found matching the criteria.</div>
                        )}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-2xl">
                        <p className="text-xs text-gray-500">Showing {filtered.length} of {schools.length} schools</p>
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
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <p className="text-sm font-semibold text-emerald-800">{selected?.name}</p>
                        <p className="text-xs text-emerald-600">{selected?.location} · {selected?.subdomain}.edumanage.ug</p>
                    </div>
                    <p className="text-sm text-gray-600">Approving this school will:
                        <ul className="list-disc ml-5 mt-1 space-y-1 text-xs text-gray-500">
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
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-sm font-semibold text-red-800">{selected?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection *</label>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            rows={3}
                            className="input-field resize-none"
                            placeholder="Provide a reason that will be emailed to the applicant..."
                        />
                    </div>
                </div>
            </Modal>

            {/* Suspend Modal */}
            <Modal isOpen={modal === 'suspend'} onClose={closeModal} title="Suspend School"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-danger" onClick={closeModal}><Pause size={14} /> Suspend School</button></>}
            >
                <p className="text-sm text-gray-600">Are you sure you want to suspend <strong>{selected?.name}</strong>? Their students and teachers will lose access immediately.</p>
            </Modal>

            {/* Login-as Modal */}
            <Modal isOpen={modal === 'login'} onClose={closeModal} title="Login as School Admin"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-primary" onClick={() => { closeModal(); window.location.href = '/schooladmin'; }}><LogIn size={14} /> Enter School Portal</button></>}
            >
                <p className="text-sm text-gray-600">You are about to impersonate <strong>{selected?.name}</strong> as their School Admin. All actions will be logged for audit.</p>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete School"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-danger" onClick={closeModal}><Trash2 size={14} /> Permanently Delete</button></>}
            >
                <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm font-semibold text-red-800">⚠ This action is irreversible</p>
                    </div>
                    <p className="text-sm text-gray-600">Deleting <strong>{selected?.name}</strong> will permanently remove all data including students, grades, attendance records, and payment history.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type school name to confirm</label>
                        <input className="input-field" placeholder={selected?.name} />
                    </div>
                </div>
            </Modal>

            {/* View Modal */}
            <Modal isOpen={modal === 'view'} onClose={closeModal} title="School Details" size="lg"
                footer={<button className="btn-secondary" onClick={closeModal}>Close</button>}
            >
                {selected && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {[
                            ['School Name', selected.name], ['Level', selected.level],
                            ['Location', selected.location], ['Subdomain', `${selected.subdomain}.edumanage.ug`],
                            ['Plan', selected.plan], ['Status', selected.status],
                            ['Payment', selected.payment], ['Students', selected.students],
                            ['Teachers', selected.teachers],
                        ].map(([k, v]) => (
                            <div key={k} className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 font-medium">{k}</p>
                                <p className="text-gray-900 font-semibold mt-0.5">{v}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            {/* Add School Modal */}
            <Modal isOpen={modal === 'add'} onClose={closeModal} title="Add New School" size="lg"
                footer={<><button className="btn-secondary" onClick={closeModal}>Cancel</button><button className="btn-primary" onClick={closeModal}><Plus size={14} /> Create School</button></>}
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input type="text" placeholder="e.g., Greenhill Academy" className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Level</label>
                        <select className="select-field">
                            <option value="Primary">Primary</option>
                            <option value="Secondary">Secondary</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / District</label>
                        <input type="text" placeholder="e.g., Kampala" className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" placeholder="admin@school.ug" className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" placeholder="+256 700 000000" className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                        <input type="text" placeholder="greenhill" className="input-field" />
                        <p className="text-xs text-gray-400 mt-1">Will be: {'{value}'}.edumanage.ug</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                        <select className="select-field">
                            <option>Basic – UGX 200,000/mo</option>
                            <option>Pro – UGX 400,000/mo</option>
                            <option>Enterprise – UGX 800,000/mo</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
