import React, { useEffect, useState } from 'react';
import { getTradeData } from '../../services/mockData';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const TradeAppWidget: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getTradeData().then(setData);
        const interval = setInterval(() => {
            getTradeData().then(setData);
        }, 5000); // Live tick every 5s
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div className="h-full w-full bg-dark-bg/20 animate-pulse rounded-xl"></div>;

    return (
        <div className="h-full flex flex-col justify-center px-4 bg-navy-surface border border-navy-border rounded-xl shadow-navy">
            <h4 className="text-[10px] uppercase text-text-muted font-bold mb-2 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin duration-[3000ms] text-brand-primary" />
                Global Markets
            </h4>
            <div className="space-y-2">
                {data.indices.slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-text-primary font-medium">{item.name}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-text-secondary">{item.value}</span>
                            <span className={`flex items-center ${item.trend === 'up' ? 'text-status-success' : 'text-status-danger'} font-medium`}>
                                {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {item.change}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TradeAppWidget;
