import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

export default function SASupport() {
    return (
        <DashboardLayout role="superadmin">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Support & Helpdesk</h1>
                        <p className="page-subtitle">Manage support tickets and helpdesk requests from schools.</p>
                    </div>
                </div>

                <div className="card p-8 text-center text-slate-500">
                    <p>Support module is currently under development.</p>
                </div>
            </div>
        </DashboardLayout>
    )
}
