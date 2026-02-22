import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { AlertTriangle, RefreshCw, LogOut, Megaphone, PowerOff, ShieldAlert } from 'lucide-react'

const actions = [
    { id: 'shutdown', label: 'Platform Shutdown', desc: 'Immediately shut down all services. Use only in extreme emergencies.', icon: PowerOff, color: 'bg-red-600 hover:bg-red-700', confirm: 'SHUTDOWN' },
    { id: 'rollback', label: 'Rollback Last Deploy', desc: 'Revert to the previous stable deployment. Current session will not be disturbed.', icon: RefreshCw, color: 'bg-amber-600 hover:bg-amber-700', confirm: 'ROLLBACK' },
    { id: 'forcelogout', label: 'Force Logout All Users', desc: 'Invalidate all active sessions across the platform. All users will need to log in again.', icon: LogOut, color: 'bg-orange-600 hover:bg-orange-700', confirm: 'FORCE-LOGOUT' },
    { id: 'broadcast', label: 'Emergency Broadcast', desc: 'Send an urgent message to all users via all channels immediately.', icon: Megaphone, color: 'bg-blue-700 hover:bg-blue-800', confirm: null },
]

export default function SAEmergency() {
    const [modal, setModal] = useState(null)
    const [confirmText, setConfirmText] = useState('')
    const [broadcastMsg, setBroadcastMsg] = useState('')

    const currentAction = actions.find(a => a.id === modal)

    const close = () => { setModal(null); setConfirmText(''); setBroadcastMsg('') }
    const canConfirm = currentAction?.confirm ? confirmText === currentAction.confirm : true

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title flex items-center gap-2"><ShieldAlert className="text-red-500" />Emergency Controls</h1><p className="page-subtitle text-red-500 font-medium">⚠ These actions are critical and may affect all schools and users</p></div>

                <div className="p-4 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-3">
                    <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-800">Danger Zone</p>
                        <p className="text-xs text-red-600 mt-1">All actions on this page are irreversible or have immediate platform-wide impact. They are logged and audited. Proceed with extreme caution.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actions.map(a => (
                        <div key={a.id} className="card border-2 border-gray-100 hover:border-red-200 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-50 rounded-xl flex-shrink-0"><a.icon size={22} className="text-red-600" /></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{a.label}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{a.desc}</p>
                                </div>
                            </div>
                            <button onClick={() => setModal(a.id)} className={`mt-5 w-full text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 ${a.color}`}>
                                <a.icon size={15} /> {a.label}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Audit log */}
                <div className="card">
                    <h2 className="section-title">Emergency Action Audit Log</h2>
                    <div className="space-y-3">
                        {[
                            { action: 'Force Logout All', by: 'James Mugisha', time: '2026-01-15 03:22:01', reason: 'Suspected breach' },
                            { action: 'Emergency Broadcast', by: 'Sarah Nakato', time: '2025-12-24 22:10:00', reason: 'System downtime notice' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div><p className="text-sm font-semibold text-gray-900">{log.action}</p><p className="text-xs text-gray-500">By {log.by} · {log.time}</p></div>
                                <div className="text-right"><p className="text-xs text-gray-500">{log.reason}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <Modal isOpen={modal !== null && modal !== 'broadcast'} onClose={close} title={`Confirm: ${currentAction?.label}`}
                footer={
                    <>
                        <button className="btn-secondary" onClick={close}>Cancel</button>
                        <button disabled={!canConfirm} className={`btn-danger disabled:opacity-40 disabled:cursor-not-allowed`} onClick={close}>
                            <ShieldAlert size={14} /> Confirm {currentAction?.label}
                        </button>
                    </>
                }
            >
                {currentAction && (
                    <div className="space-y-4">
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl"><p className="text-sm text-red-700 font-medium">⚠ {currentAction.desc}</p></div>
                        <p className="text-sm text-gray-700">Type <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded font-bold text-red-600">{currentAction.confirm}</code> to confirm:</p>
                        <input value={confirmText} onChange={e => setConfirmText(e.target.value)} className="input-field font-mono font-bold tracking-widest" placeholder={currentAction.confirm} />
                    </div>
                )}
            </Modal>

            {/* Broadcast Modal */}
            <Modal isOpen={modal === 'broadcast'} onClose={close} title="Emergency Broadcast"
                footer={<><button className="btn-secondary" onClick={close}>Cancel</button><button className="btn-danger" onClick={close}><Megaphone size={14} /> Send Emergency Broadcast</button></>}
            >
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl"><p className="text-sm text-amber-700">This will send an immediate message to ALL users on all channels.</p></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input className="input-field" placeholder="Emergency Notice" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Message *</label><textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} className="input-field resize-none" rows={4} placeholder="Describe the emergency situation..." /></div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
