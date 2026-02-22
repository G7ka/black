import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
)

const defaultLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } } },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
    },
}

const defaultBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } } },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } } },
    },
}

export function LineChart({ data, options = {}, height = 240 }) {
    return (
        <div style={{ height }}>
            <Line data={data} options={{ ...defaultLineOptions, ...options }} />
        </div>
    )
}

export function BarChart({ data, options = {}, height = 240 }) {
    return (
        <div style={{ height }}>
            <Bar data={data} options={{ ...defaultBarOptions, ...options }} />
        </div>
    )
}

export function DoughnutChart({ data, options = {}, height = 240 }) {
    return (
        <div style={{ height }}>
            <Doughnut
                data={data}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { font: { size: 11 }, usePointStyle: true } }
                    },
                    ...options
                }}
            />
        </div>
    )
}
