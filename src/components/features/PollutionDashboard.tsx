import React, { useEffect, useState } from 'react';
import { getPollutionData } from '../../services/mockData';
import type { Coordinates } from '../../types';
import AINsightCard from './AINsightCard';
import NewsFeed from './NewsFeed';
import MetricCard from './MetricCard';
import { Wind, Activity, CloudFog } from 'lucide-react';
import { getMetricColorClass, getAQIColorClass } from '../../utils/metrics';
import ColorLegend from '../common/ColorLegend';

interface Props {
    coords: Coordinates;
    locationData: {
        name: string;
        state?: string;
        country: string;
    };
}

const PollutionDashboard: React.FC<Props> = ({ coords, locationData }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getPollutionData(coords).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [coords]);

    if (loading) {
        return <div className="flex h-full items-center justify-center text-dark-muted animate-pulse">Analyzing atmospheric composition...</div>;
    }

    if (!data) return <div className="text-dark-muted">No pollution data available.</div>;

    // Mock graph data generator
    const generateTrend = (base: number, volatility: number) => {
        return Array.from({ length: 12 }, (_, i) => ({
            time: `${i * 2}h`,
            value: Math.round(base + (Math.random() * volatility - volatility / 2))
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Main AQI Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* AQI Big Card */}
                    <div className="col-span-2 sm:col-span-1 rounded-2xl bg-navy-surface border border-navy-border p-6 flex flex-col items-center justify-center relative overflow-hidden group shadow-navy">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-brand-primary/10 pointer-events-none"></div>
                        <h3 className="text-text-secondary font-medium mb-2">Air Quality Index</h3>
                        <span className={`text-6xl font-bold tracking-tighter ${getAQIColorClass(data.aqi)}`}>
                            {data.aqi}
                        </span>
                        <span className="text-sm text-text-muted mt-2">Main: {data.mainPollutant}</span>

                        {/* Slide up for AQI explanation */}
                        <div className="absolute inset-x-0 bottom-0 h-full translate-y-full bg-navy-main/90 backdrop-blur-md p-6 transition-transform duration-300 group-hover:translate-y-0 flex flex-col justify-center items-center text-center">
                            <p className="text-sm font-medium text-text-primary">
                                {data.aqi < 50 ? "Air is clean and healthy." : data.aqi < 100 ? "Moderate quality." : "Pollution levels are high."}
                            </p>
                        </div>
                    </div>

                    {/* Key Metrics with Hover Predictions */}
                    <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-4">
                        <MetricCard
                            title="PM2.5"
                            value={data.components.pm2_5}
                            colorClass={getMetricColorClass('pm2_5', data.components.pm2_5)}
                            icon={CloudFog}
                            prediction="Levels expected to rise slightly."
                            trend="up"
                            chartData={generateTrend(data.components.pm2_5, 5)}
                        />
                        <MetricCard
                            title="PM10"
                            value={data.components.pm10}
                            colorClass={getMetricColorClass('pm10', data.components.pm10)}
                            icon={Wind}
                            prediction="Stable conditions expected."
                            trend="neutral"
                            chartData={generateTrend(data.components.pm10, 8)}
                        />
                        <MetricCard
                            title="NO2"
                            value={data.components.no2}
                            colorClass={getMetricColorClass('no2', data.components.no2)}
                            icon={Activity}
                            prediction="Traffic peak may increase NO2."
                            trend="up"
                            chartData={generateTrend(data.components.no2, 10)}
                        />
                        <MetricCard
                            title="O3"
                            value={data.components.o3}
                            colorClass={getMetricColorClass('o3', data.components.o3)}
                            icon={Activity}
                            prediction="Ozone levels dropping."
                            trend="down"
                            chartData={generateTrend(data.components.o3, 15)}
                        />
                    </div>
                </div>

                {/* Color Legend Index */}
                <ColorLegend />

                {/* AI Insight */}
                <AINsightCard insight={data.insight} />

                {/* Pollution Forecast */}
                {data.forecast && (
                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-text-secondary mb-3">Air Quality Forecast</h4>
                        <div className="grid grid-cols-5 gap-2">
                            {data.forecast.map((day: any, i: number) => (
                                <div key={i} className="rounded-xl bg-navy-surface border border-navy-border p-2 flex flex-col items-center text-center shadow-sm">
                                    <span className="text-[10px] text-text-muted">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <div className={`text-sm font-bold my-1 ${getAQIColorClass(day.aqi_max)}`}>{day.aqi_max}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* News Feed Section */}
            <div className="space-y-6">
                <NewsFeed
                    topic="Pollution"
                    location={{
                        city: locationData.name.split(',')[0],
                        state: locationData.state,
                        country: locationData.country
                    }}
                />
            </div>
        </div>
    );
};

export default PollutionDashboard;
