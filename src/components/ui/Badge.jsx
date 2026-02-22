import React from 'react'

export default function Badge({ children, variant = 'info' }) {
    const variants = {
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
        gray: 'badge-gray',
        purple: 'badge bg-purple-100 text-purple-700',
        indigo: 'badge bg-indigo-100 text-indigo-700',
        orange: 'badge bg-orange-100 text-orange-700',
    }
    return (
        <span className={variants[variant] || variants.info}>{children}</span>
    )
}
