import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    prediction?: string;
    colorClass?: string;
    chartData?: any[]; // Simple array for graph
    dataKey?: string; // Key to map data
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    unit = '',
    icon: Icon,
    trend = 'neutral',
    prediction,
    colorClass = 'text-text-primary',
    chartData = [],
    dataKey = 'value'
}) => {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-navy-surface border border-navy-border p-4 transition-all duration-500 hover:shadow-navy-hover hover:bg-navy-main hover:h-64 h-32 flex flex-col justify-start shadow-navy">

            {/* Static Header Content */}
            <div className="flex items-center gap-2 text-text-muted mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{title}</span>
            </div>

            {/* Main Value */}
            <div className="flex items-end gap-1 mb-2">
                <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
                <span className="text-sm text-text-muted mb-1">{unit}</span>
            </div>

            {/* Hidden Expanded Content - Revealed on Hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex flex-col flex-1 mt-2">

                {/* Prediction Text */}
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                    {trend === 'up' && <TrendingUp className="w-3 h-3 text-status-danger" />}
                    {trend === 'down' && <TrendingDown className="w-3 h-3 text-status-success" />}
                    {trend === 'neutral' && <Minus className="w-3 h-3 text-gray-400" />}
                    Forecast
                </div>
                <p className="text-xs text-text-primary leading-snug mb-2">
                    {prediction || "No change expected."}
                </p>

                {/* Mini Chart */}
                <div className="flex-1 w-full min-h-0">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5BC0BE" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#5BC0BE" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(11, 19, 43, 0.95)', border: '1px solid #3A506B', borderRadius: '8px', fontSize: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(val: any) => [`${val} ${unit}`, title]}
                                    labelStyle={{ display: 'none' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={dataKey}
                                    stroke="#5BC0BE"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${title})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[10px] text-text-muted bg-navy-main rounded-lg">
                            No chart data
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MetricCard;
