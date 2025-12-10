import React, { useEffect, useState } from 'react';
import { getWeatherData } from '../../services/mockData';
import type { Coordinates } from '../../types';
import AINsightCard from './AINsightCard';
import NewsFeed from './NewsFeed';
import MetricCard from './MetricCard';
import { Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { getMetricColorClass } from '../../utils/metrics';
import ColorLegend from '../common/ColorLegend';

interface Props {
    coords: Coordinates;
    locationData: {
        name: string;
        state?: string;
        country: string;
    };
}

const WeatherDashboard: React.FC<Props> = ({ coords, locationData }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getWeatherData(coords).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [coords]);

    // Mock graph data generator
    const generateTrend = (base: number, volatility: number) => {
        return Array.from({ length: 12 }, (_, i) => ({
            time: `${i * 2}h`,
            value: Math.round(base + (Math.random() * volatility - volatility / 2))
        }));
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center text-dark-muted animate-pulse">Forecasting weather patterns...</div>;
    }

    if (!data) return <div className="text-text-muted">No weather data available.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full text-text-primary">
            {/* Main Weather Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* Main Temp Card */}
                    <div className="col-span-2 sm:col-span-1 rounded-2xl bg-gradient-to-br from-navy-surface to-navy-main border border-navy-border p-6 flex flex-col items-center justify-center relative overflow-hidden group shadow-navy">
                        <div className="flex items-center gap-2 mb-2 text-brand-primary">
                            <Sun className="w-8 h-8" />
                            <span className="text-lg font-medium">{data.description}</span>
                        </div>
                        <div className={`text-6xl font-bold tracking-tighter ${getMetricColorClass('temp', data.temp)}`}>
                            {data.temp}°
                        </div>
                        <span className="text-sm text-text-secondary mt-2">Feels like {data.feels_like}°</span>

                        {/* Forecast Section */}
                        {data.forecast && (
                            <div className="grid grid-cols-4 gap-2 mt-4 w-full">
                                {data.forecast.slice(0, 4).map((day: any, i: number) => (
                                    <div key={i} className="rounded-xl bg-navy-surface border border-navy-border p-2 flex flex-col items-center text-center shadow-sm">
                                        <span className="text-[10px] text-text-muted">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <Sun className="w-3 h-3 text-brand-primary my-1" />
                                        <span className="text-xs font-bold">{Math.round(day.temp_max)}°</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Scale on hover effect */}
                        <div className="absolute inset-0 border-2 border-brand-primary/0 group-hover:border-brand-primary/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
                    </div>

                    {/* Metrics with Hover */}
                    <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-4">
                        <MetricCard
                            title="Humidity"
                            value={data.humidity}
                            colorClass={getMetricColorClass('humidity', data.humidity)}
                            unit="%"
                            icon={Droplets}
                            prediction="Humidity likely to increase tonight."
                            trend="up"
                            chartData={generateTrend(data.humidity, 10)}
                        />
                        <MetricCard
                            title="Wind"
                            value={data.wind_speed}
                            colorClass={getMetricColorClass('wind', data.wind_speed)}
                            unit="km/h"
                            icon={Wind}
                            prediction="Gusts may reach 25 km/h."
                            trend="neutral"
                            chartData={generateTrend(data.wind_speed, 5)}
                        />
                        <MetricCard
                            title="Precip"
                            value="0"
                            unit="%"
                            icon={CloudRain}
                            prediction="No rain expected in next 24h."
                            trend="neutral"
                            chartData={generateTrend(5, 5).map(d => ({ ...d, value: d.value < 0 ? 0 : d.value }))}
                        />
                        <MetricCard
                            title="UV Index"
                            value={data.uv_index || 'Low'}
                            colorClass={getMetricColorClass('uv', typeof data.uv_index === 'number' ? data.uv_index : 0)}
                            icon={Thermometer}
                            prediction={data.is_day ? "UV dropping as sun sets." : "UV is 0 at night."}
                            trend="down"
                            chartData={[{ time: 'Now', value: data.uv_index || 0 }, { time: '+2h', value: Math.max(0, (data.uv_index || 0) - 1) }, { time: '+4h', value: 0 }]}
                        />
                    </div>
                </div>

                {/* Color Legend Index */}
                <ColorLegend />

                {/* AI Insight (Custom for Weather) */}
                <AINsightCard insight={`Weather is ${data.description.toLowerCase()} with reasonable humidity. Good conditions for travel.`} />
            </div>

            {/* News Feed Section */}
            <div className="space-y-6">
                <NewsFeed
                    topic="Weather"
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

export default WeatherDashboard;
