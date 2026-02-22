import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Activity, Server, HardDrive, Users, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

const initialAlerts = [
    { id: 1, level: 'critical', message: 'High memory usage on server-01 (92%)', time: '2 min ago' },
    { id: 2, level: 'warning', message: 'Slow query detected on db-schools collection', time: '15 min ago' },
    { id: 3, level: 'info', message: 'Scheduled backup completed successfully', time: '1 hr ago' },
    { id: 4, level: 'info', message: 'SSL certificates renewed automatically', time: '3 hr ago' },
]

const logs = [
    { time: '09:52:01', level: 'ERROR', message: '[DB] Connection pool exhausted — retrying (attempt 3/5)' },
    { time: '09:52:14', level: 'INFO', message: '[AUTH] User james@edumanage.ug logged in from 197.157.x.x' },
    { time: '09:51:50', level: 'WARN', message: '[API] Rate limit approached: /api/schools (450/500 rpm)' },
    { time: '09:51:33', level: 'INFO', message: '[CRON] Invoice generation job completed: 23 invoices created' },
    { time: '09:51:10', level: 'INFO', message: '[SCHOOL] Greenhill Academy approved by admin james@edumanage.ug' },
    { time: '09:50:55', level: 'ERROR', message: '[SMS] Africa\'s Talking delivery failure: MTN network timeout' },
    { time: '09:50:22', level: 'INFO', message: '[BACKUP] Daily backup to S3 started — edumanage-backups-ug' },
]

function StatPill({ label, value, colorClass }) {
    return (
        <div className={`flex flex-col items-center p-4 rounded-2xl ${colorClass}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
        </div>
    )
}

export default function SAMonitoring() {
    const [cpu, setCpu] = useState(34)
    const [mem, setMem] = useState(67)
    const [logFilter, setLogFilter] = useState('ALL')

    useEffect(() => {
        const t = setInterval(() => {
            setCpu(Math.floor(Math.random() * 30) + 25)
            setMem(Math.floor(Math.random() * 20) + 60)
        }, 3000)
        return () => clearInterval(t)
    }, [])

    const filteredLogs = logFilter === 'ALL' ? logs : logs.filter(l => l.level === logFilter)

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">System Monitoring</h1><p className="page-subtitle">Real-time server stats, alerts, and logs</p></div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> All Systems Operational
                    </div>
                </div>

                {/* Server Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card text-center">
                        <div className="flex items-center justify-center mb-2"><Activity size={20} className="text-blue-500" /></div>
                        <p className="text-xs text-gray-500 font-medium">CPU Usage</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{cpu}%</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2"><div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${cpu}%` }} /></div>
                    </div>
                    <div className="card text-center">
                        <div className="flex items-center justify-center mb-2"><HardDrive size={20} className="text-violet-500" /></div>
                        <p className="text-xs text-gray-500 font-medium">Memory</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{mem}%</p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2"><div className={`h-1.5 rounded-full transition-all ${mem > 85 ? 'bg-red-500' : 'bg-violet-500'}`} style={{ width: `${mem}%` }} /></div>
                    </div>
                    <div className="card text-center">
                        <div className="flex items-center justify-center mb-2"><Server size={20} className="text-emerald-500" /></div>
                        <p className="text-xs text-gray-500 font-medium">Uptime</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">99.8%</p>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">↑ 47 days</p>
                    </div>
                    <div className="card text-center">
                        <div className="flex items-center justify-center mb-2"><Users size={20} className="text-amber-500" /></div>
                        <p className="text-xs text-gray-500 font-medium">Active Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">1,247</p>
                        <p className="text-xs text-gray-400 mt-1">right now</p>
                    </div>
                </div>

                {/* Alerts */}
                <div className="card">
                    <h2 className="section-title">Active Alerts</h2>
                    <div className="space-y-3">
                        {initialAlerts.map(a => (
                            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border ${a.level === 'critical' ? 'bg-red-50 border-red-200' : a.level === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'}`}>
                                {a.level === 'critical' ? <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" /> : a.level === 'warning' ? <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" /> : <CheckCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />}
                                <div className="flex-1 min-w-0"><p className="text-sm text-gray-700">{a.message}</p><p className="text-xs text-gray-400">{a.time}</p></div>
                                <Badge variant={a.level === 'critical' ? 'danger' : a.level === 'warning' ? 'warning' : 'info'}>{a.level}</Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logs */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title mb-0">System Logs</h2>
                        <div className="flex gap-2">
                            {['ALL', 'INFO', 'WARN', 'ERROR'].map(l => (
                                <button key={l} onClick={() => setLogFilter(l)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${logFilter === l ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
                            ))}
                            <button className="btn-secondary text-xs py-1 px-2"><RefreshCw size={12} /></button>
                        </div>
                    </div>
                    <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
                        {filteredLogs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-gray-500 flex-shrink-0">{log.time}</span>
                                <span className={`flex-shrink-0 font-bold w-10 ${log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}`}>{log.level}</span>
                                <span className="text-gray-300">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
