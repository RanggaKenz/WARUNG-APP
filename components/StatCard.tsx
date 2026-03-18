interface StatCardProps {
    label: string
    value: string
    sub?: string
    trend: 'up' | 'down' | 'neutral'
}

export default function StatCard({ label, value, sub, trend }: StatCardProps) {
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
    const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-xl font-medium text-gray-800 mb-1">{value}</div>
            {sub && <div className="text-sm text-gray-400">{sub}</div>}
            <div className={`text-sm font-semibold ${trendColor}`}>{trendIcon}</div>
        </div>
    )
}