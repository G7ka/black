import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Key, Search, Copy, RefreshCw, Terminal, CheckCircle, AlertCircle } from 'lucide-react'
import { developerToolsApi } from '../../api/developerTools.api'

export default function SADeveloperTools() {
    const [apiKeys, setApiKeys] = useState([])
    const [logs, setLogs] = useState([])
    const [logQuery, setLogQuery] = useState('')
    const [copied, setCopied] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [newKeyName, setNewKeyName] = useState('')
    const [revealedKey, setRevealedKey] = useState(null) // { name, key } — shown once after creation
    const [creating, setCreating] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const [keys, logResult] = await Promise.all([
                developerToolsApi.listApiKeys(),
                developerToolsApi.searchLogs(logQuery || undefined),
            ])
            setApiKeys(keys)
            setLogs(logResult)
        } catch (err) {
            setError(err.message || 'Failed to load developer tools data')
        } finally {
            setLoading(false)
        }
    }, [logQuery])

    useEffect(() => { load() }, [load])

    const copyKey = (id, key) => {
        navigator.clipboard.writeText(key).catch(() => { })
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const createKey = async () => {
        if (!newKeyName.trim()) return
        setCreating(true)
        setError('')
        try {
            const result = await developerToolsApi.createApiKey(newKeyName)
            setRevealedKey({ name: result.name, key: result.key })
            setNewKeyName('')
            await load()
        } catch (err) {
            setError(err.message || 'Failed to create API key')
        } finally {
            setCreating(false)
        }
    }

    const revokeKey = async (id) => {
        setError('')
        try {
            await developerToolsApi.revokeApiKey(id)
            await load()
        } catch (err) {
            setError(err.message || 'Failed to revoke key')
        }
    }

    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div><h1 className="page-title">Developer Tools</h1><p className="page-subtitle">API keys and system activity log</p></div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {revealedKey && (
                    <div className="card border-2 border-amber-300 bg-amber-50 dark:bg-amber-900/20">
                        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Copy this key now — it won't be shown again</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 break-all">{revealedKey.key}</code>
                            <button onClick={() => { navigator.clipboard.writeText(revealedKey.key); }} className="btn-secondary text-xs py-1.5"><Copy size={12} /> Copy</button>
                            <button onClick={() => setRevealedKey(null)} className="btn-primary text-xs py-1.5">Done</button>
                        </div>
                    </div>
                )}

                {/* API Keys */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <h2 className="section-title mb-0">API Keys</h2>
                        <div className="flex gap-2">
                            <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Key name (e.g. Integration Key)" className="input-field text-xs py-1.5" />
                            <button disabled={creating || !newKeyName.trim()} className="btn-primary text-xs py-1.5 disabled:opacity-50" onClick={createKey}><Key size={13} /> {creating ? 'Generating…' : 'Generate New Key'}</button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {loading && <p className="text-sm text-gray-400">Loading…</p>}
                        {!loading && apiKeys.length === 0 && <p className="text-sm text-gray-400">No API keys yet.</p>}
                        {apiKeys.map(k => (
                            <div key={k.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-slate-700">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{k.name}</p>
                                    <p className="text-xs font-mono text-gray-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">{k.keyPrefix}••••••••</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Created: {new Date(k.createdAt).toLocaleDateString()} · Last used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'} · <span className={k.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500'}>{k.status.toLowerCase()}</span></p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4">
                                    <button onClick={() => copyKey(k.id, k.keyPrefix)} className="btn-secondary text-xs py-1.5 px-3">
                                        {copied === k.id ? <><CheckCircle size={11} className="text-emerald-500 dark:text-emerald-400" /> Copied</> : <><Copy size={11} /> Copy Prefix</>}
                                    </button>
                                    {k.status === 'ACTIVE' && (
                                        <button onClick={() => revokeKey(k.id)} className="btn-danger text-xs py-1.5 px-3"><RefreshCw size={11} /> Revoke</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Log Searcher — real EmailLog + AuditLog activity, not fabricated */}
                <div className="card">
                    <h2 className="section-title flex items-center gap-2"><Terminal size={16} /> System Activity Log</h2>
                    <div className="relative mb-4">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={logQuery} onChange={e => setLogQuery(e.target.value)} className="input-field pl-9" placeholder="Search logs (e.g., FAILED, SCHOOL_APPROVED)..." />
                    </div>
                    <div className="bg-gray-950 rounded-xl p-4 font-mono text-xs space-y-1.5 max-h-72 overflow-y-auto">
                        {logs.length ? logs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-gray-500 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className={`flex-shrink-0 font-bold w-14 ${log.level === 'ERROR' ? 'text-red-400' : 'text-emerald-400'}`}>{log.source}</span>
                                <span className={`text-sm ${log.level === 'ERROR' ? 'text-red-300' : 'text-gray-300'}`}>{log.message}</span>
                            </div>
                        )) : <p className="text-gray-500">No logs match your query.</p>}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
