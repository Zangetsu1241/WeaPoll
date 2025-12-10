import React from 'react';

const ColorLegend: React.FC = () => {
    const items = [
        { label: 'Good', color: 'bg-aqi-good' },
        { label: 'Moderate', color: 'bg-aqi-moderate' },
        { label: 'Sensitive', color: 'bg-aqi-sensitive' },
        { label: 'Unhealthy', color: 'bg-aqi-unhealthy' },
        { label: 'Very Unhealthy', color: 'bg-aqi-very_unhealthy' },
        { label: 'Hazardous', color: 'bg-aqi-hazardous' },
    ];

    return (
        <div className="w-full flex flex-wrap items-center justify-center gap-4 py-3 px-4 mt-2 rounded-xl bg-navy-surface border border-navy-border/50">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider mr-2">Index:</span>
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm border border-white/10`}></div>
                    <span className="text-[10px] text-text-secondary font-medium">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default ColorLegend;
