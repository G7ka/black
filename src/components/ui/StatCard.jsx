import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
    const colorMap = {
        blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
        green: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
        amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
        red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', text: 'text-red-600' },
        purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
        indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-600' },
    }
    const c = colorMap[color] || colorMap.blue

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
    const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'

    return (
        <div className="stat-card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                    {trendValue && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
                            <TrendIcon size={13} />
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${c.icon}`}>
                        <Icon size={22} />
                    </div>
                )}
            </div>
        </div>
    )
}
