import React, { useEffect, useState } from 'react';
import { getNews } from '../../services/mockData';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    url: string;
    source: string;
    time: string;
}

interface NewsFeedProps {
    topic: string;
    location?: {
        city: string;
        state?: string;
        country: string;
    };
    scope?: 'global';
}

const NewsFeed: React.FC<NewsFeedProps> = ({ topic, location, scope }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Construct the correct params object for getNews
        const fetchParams = scope === 'global' ? { scope: 'global' as const } : location;

        getNews(topic, fetchParams).then(res => {
            setNews(res);
            setLoading(false);
        });
    }, [topic, location, scope]);

    if (loading) {
        return <div className="text-text-muted text-sm animate-pulse">Scanning news wires...</div>;
    }

    if (news.length === 0) {
        return <div className="text-text-muted text-sm">No recent news found.</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                {scope === 'global' ? `Global ${topic} News` : `${topic} News`}
            </h3>
            {news.map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="rounded-xl bg-navy-surface p-4 border border-navy-border transition-all duration-300 hover:shadow-navy-hover hover:border-brand-primary/50 group-hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-brand-primary bg-navy-main px-2 py-0.5 rounded-full border border-navy-border">
                                {item.source}
                            </span>
                            <span className="text-[10px] text-text-muted flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(item.time).toLocaleDateString()}
                            </span>
                        </div>
                        <h4 className="text-sm font-semibold text-text-primary group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
                            {item.title}
                        </h4>
                        <div className="mt-3 flex items-center gap-1 text-xs text-text-muted group-hover:text-brand-primary font-medium">
                            Read Article <ExternalLink className="w-3 h-3" />
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default NewsFeed;
