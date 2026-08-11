import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import Badge from '../../components/ui/Badge'
import { Activity, Server, HardDrive, Users, AlertTriangle, CheckCircle, XCircle, RefreshCw,DownloadIcon } from 'lucide-react'
import { monitoringApi } from '../../api/platformOps.api'

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
}

export default function SAMonitoring() {
    const [stats, setStats] = useState(null)
    const [alerts, setAlerts] = useState([])
    const [logs, setLogs] = useState([])
    const [logFilter, setLogFilter] = useState('ALL')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setError('')
        try {
            const [statsResult, alertsResult, logsResult] = await Promise.all([
                monitoringApi.stats(),
                monitoringApi.alerts(),
                monitoringApi.logs(),
            ])
            setStats(statsResult)
            setAlerts(alertsResult)
            setLogs(logsResult)
        } catch (err) {
            setError(err.message || 'Failed to load monitoring data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
        const t = setInterval(load, 10000) // real refresh, not a fake random-number timer
        return () => clearInterval(t)
    }, [load])

    const filteredLogs = logFilter === 'ALL' ? logs : logs.filter(l => l.level === logFilter)

    if (loading) {
        return <DashboardLayout role="superadmin"><p className="text-sm text-gray-400">Loading monitoring data…</p></DashboardLayout>
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="page-title">System Monitoring</h1><p className="page-subtitle">Real server process stats, derived alerts, and activity logs</p></div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card text-center">
                            <div className="flex items-center justify-center mb-2"><Activity size={20} className="text-blue-500 dark:text-blue-400" /></div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">CPU Load (1m avg)</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.cpuLoadPct}%</p>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mt-2"><div className="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full transition-all" style={{ width: `${stats.cpuLoadPct}%` }} /></div>
                        </div>
                        <div className="card text-center">
                            <div className="flex items-center justify-center mb-2"><HardDrive size={20} className="text-violet-500 dark:text-violet-400" /></div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Memory Used</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.memoryUsedPct}%</p>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mt-2"><div className={`h-1.5 rounded-full transition-all ${stats.memoryUsedPct > 85 ? 'bg-red-500 dark:bg-red-400' : 'bg-violet-500 dark:bg-violet-400'}`} style={{ width: `${stats.memoryUsedPct}%` }} /></div>
                        </div>
                        <div className="card text-center">
                            <div className="flex items-center justify-center mb-2"><Server size={20} className="text-emerald-500 dark:text-emerald-400" /></div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Process Uptime</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatUptime(stats.processUptimeSeconds)}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">since last deploy/restart</p>
                        </div>
                        <div className="card text-center">
                            <div className="flex items-center justify-center mb-2"><Users size={20} className="text-amber-500 dark:text-amber-400" /></div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Active Sessions</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeSessions}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">non-revoked refresh tokens</p>
                        </div>
                    </div>
                )}

                {/* Alerts */}
                <div className="card">
                    <h2 className="section-title">Active Alerts</h2>
                    <div className="space-y-3">
                        {alerts.length === 0 && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                <CheckCircle size={16} /> No active alerts — all monitored conditions are normal.
                            </div>
                        )}
                        {alerts.map((a, i) => (
                            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${a.level === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'}`}>
                                {a.level === 'critical' ? <XCircle size={16} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" /> : <AlertTriangle size={16} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />}
                                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 dark:text-white">{a.message}</p></div>
                                <Badge variant={a.level === 'critical' ? 'danger' : 'warning'}>{a.level}</Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logs */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-title mb-0">Activity Log</h2>
                        <div className="flex gap-2">
                            {['ALL', 'INFO', 'ERROR'].map(l => (
                                <button key={l} onClick={() => setLogFilter(l)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${logFilter === l ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
                            ))}
                            <button onClick={load} className="btn-secondary text-xs py-1 px-2"><RefreshCw size={12} /></button>
                            <button  className="btn-secondary text-xs py-1 px-2"><DownloadIcon size={12} /></button>
                            
                        </div>
                    </div>
                    <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
                        {filteredLogs.length === 0 && <p className="text-gray-500">No logs match this filter.</p>}
                        {filteredLogs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-gray-500 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className={`flex-shrink-0 font-bold w-14 ${log.level === 'ERROR' ? 'text-red-400' : 'text-emerald-400'}`}>{log.source}</span>
                                <span className="text-gray-300">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
