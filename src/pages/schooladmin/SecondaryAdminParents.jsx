import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

export default function SecondaryAdminParents() {
    return (
        <DashboardLayout role="schooladmin-secondary">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">Parents Management</h1>
                        <p className="page-subtitle">Manage parent information for Secondary school students.</p>
                    </div>
                </div>

                <div className="card p-8 text-center text-slate-500">
                    <p>Parents module is currently under development.</p>
                </div>
            </div>
        </DashboardLayout>
    )
}
