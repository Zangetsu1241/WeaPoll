import React, { useEffect, useState } from 'react';
import { getNews } from '../../services/mockData';
import TradeAppWidget from './TradeAppWidget';
import { Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';

const GlobalNewsRow: React.FC = () => {
    const [news, setNews] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const fetchNewsData = async () => {
        // Fetch mixed bag of global news
        const [gen, biz, tech] = await Promise.all([
            getNews('World', { scope: 'global', category: 'Geopolitics' }),
            getNews('Business', { scope: 'global', category: 'Global Trade' }),
            getNews('Tech', { scope: 'global', category: 'Technology' })
        ]);
        // Interleave logic
        const combined = [...gen, ...biz, ...tech].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNews(combined.slice(0, 10));
    };

    useEffect(() => {
        fetchNewsData(); // Initial load

        const refreshInterval = setInterval(() => {
            fetchNewsData();
        }, 20000); // Refresh every 20 seconds

        return () => clearInterval(refreshInterval);
    }, []);

    // Manual Navigation Handlers
    const handlePrev = () => {
        setActiveIndex(prev => (prev - 1 + news.length) % news.length);
    };

    const handleNext = () => {
        setActiveIndex(prev => (prev + 1) % news.length);
    };

    // Auto-scroll ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % news.length);
        }, 5000); // Slowed down slightly for better UX with manual controls
        return () => clearInterval(interval);
    }, [news]);

    if (!news.length) return null;

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 h-32">
            {/* Left: News Ticker / Featured Story */}
            <div className="lg:col-span-3 bg-gradient-to-r from-navy-surface to-navy-main border border-navy-border rounded-2xl p-4 flex items-center relative overflow-hidden shadow-navy group">
                <div className="absolute top-2 left-4 flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest">
                    <Newspaper className="w-4 h-4" />
                    Global Briefing
                </div>

                {/* Left Navigation Arrow */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-navy-main/50 hover:bg-brand-primary/20 text-brand-primary transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="w-full mt-4">
                    {news.map((item, i) => (
                        <div
                            key={item.id}
                            className={`transition-all duration-500 absolute inset-x-12 top-10 ${i === activeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                        >
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block hover:text-brand-accent transition-colors">
                                <h3 className="text-xl font-bold text-text-primary line-clamp-1 text-center">{item.title}</h3>
                                <div className="flex justify-center gap-3 mt-1 text-xs text-text-secondary">
                                    <span className="text-brand-primary font-medium">{item.source}</span>
                                    <span>•</span>
                                    <span>{new Date(item.time).toLocaleTimeString()}</span>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Right Navigation Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-navy-main/50 hover:bg-brand-primary/20 text-brand-primary transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {news.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-brand-primary' : 'w-1.5 bg-navy-border'}`}></div>
                    ))}
                </div>
            </div>

            {/* Right: Trade Widget */}
            <div className="lg:col-span-1">
                <TradeAppWidget />
            </div>
        </div>
    );
};

export default GlobalNewsRow;
