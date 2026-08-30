import React, { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { AlertTriangle, RefreshCw, LogOut, Megaphone, PowerOff, ShieldAlert, CheckCircle2 } from 'lucide-react'

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
    const [broadcastTitle, setBroadcastTitle] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [auditLogs, setAuditLogs] = useState([
        { action: 'Force Logout All', by: 'James Mugisha', time: '2026-01-15 03:22:01', reason: 'Suspected breach' },
        { action: 'Emergency Broadcast', by: 'Sarah Nakato', time: '2025-12-24 22:10:00', reason: 'System downtime notice' },
    ])

    const currentAction = actions.find(a => a.id === modal)

    const close = () => {
        setModal(null)
        setConfirmText('')
        setBroadcastMsg('')
        setBroadcastTitle('')
    }

    const handleAction = () => {
        if (!currentAction) return;

        const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
        const newLog = {
            action: currentAction.label,
            by: 'Admin Platform (You)',
            time: now,
            reason: modal === 'broadcast' ? broadcastTitle || 'Emergency Notice' : 'Emergency protocol invoked'
        }

        setAuditLogs([newLog, ...auditLogs])
        setSuccessMsg(`Successfully executed: ${currentAction.label}`)
        setTimeout(() => setSuccessMsg(''), 5000)
        close()
    }

    const canConfirm = currentAction?.confirm ? confirmText === currentAction.confirm : true

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6 relative">

                {successMsg && (
                    <div className="absolute top-0 right-0 z-50 animate-fade-in flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-4 py-3 rounded-xl shadow-lg">
                        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-sm">{successMsg}</span>
                    </div>
                )}

                <div>
                    <h1 className="page-title flex items-center gap-2">
                        <ShieldAlert className="text-red-500" /> Emergency Controls
                    </h1>
                    <p className="page-subtitle text-red-500 font-medium">⚠ These actions are critical and may affect all schools and users</p>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-2xl flex items-start gap-3">
                    <AlertTriangle size={20} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Danger Zone</p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">All actions on this page are irreversible or have immediate platform-wide impact. They are logged and audited. Proceed with extreme caution.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actions.map(a => (
                        <div key={a.id} className="card border-2 border-gray-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/50 transition-colors flex flex-col justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl flex-shrink-0"><a.icon size={22} className="text-red-600 dark:text-red-400" /></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{a.label}</h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{a.desc}</p>
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
                        {auditLogs.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                                {i === 0 && successMsg && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{log.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">By {log.by} · {log.time}</p>
                                </div>
                                <div className="text-right"><p className="text-xs text-gray-500 dark:text-slate-400">{log.reason}</p></div>
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
                        <button disabled={!canConfirm} className={`btn-danger disabled:opacity-40 disabled:cursor-not-allowed`} onClick={handleAction}>
                            <ShieldAlert size={14} /> Confirm {currentAction?.label}
                        </button>
                    </>
                }
            >
                {currentAction && (
                    <div className="space-y-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"><p className="text-sm text-red-700 dark:text-red-300 font-medium">⚠ {currentAction.desc}</p></div>
                        <p className="text-sm text-gray-700 dark:text-slate-300">Type <code className="font-mono bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-red-600 dark:text-red-400">{currentAction.confirm}</code> to confirm:</p>
                        <input value={confirmText} onChange={e => setConfirmText(e.target.value)} className="input-field font-mono font-bold tracking-widest" placeholder={currentAction.confirm} />
                    </div>
                )}
            </Modal>

            {/* Broadcast Modal */}
            <Modal isOpen={modal === 'broadcast'} onClose={close} title="Emergency Broadcast"
                footer={<><button className="btn-secondary" onClick={close}>Cancel</button><button disabled={!broadcastMsg.trim()} className="btn-danger disabled:opacity-50" onClick={handleAction}><Megaphone size={14} /> Send Emergency Broadcast</button></>}
            >
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"><p className="text-sm text-amber-700 dark:text-amber-400">This will send an immediate message to ALL users on all channels.</p></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label><input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} className="input-field" placeholder="Emergency Notice" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message *</label><textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} className="input-field resize-none" rows={4} placeholder="Describe the emergency situation..." /></div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}
