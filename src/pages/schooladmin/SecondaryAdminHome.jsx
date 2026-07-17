import React from 'react'
import SchoolAdminHome from './SchoolAdminHome'

// Secondary's dashboard is structurally identical to Primary's — same
// data, same layout, only the role differs (drives DashboardLayout's nav
// and label copy, and which /schooladmin/secondary/* routes Quick
// Actions link to). Kept as its own file/route per the existing
// scaffold; no logic is duplicated.
export default function SecondaryAdminHome() {
    return <SchoolAdminHome role="schooladmin-secondary" />
}
