import React from 'react';
import { Sparkles } from 'lucide-react';

const AINsightCard: React.FC<{ insight: string }> = ({ insight }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 border border-navy-border p-6 shadow-navy">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-brand-primary" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-sm font-bold text-brand-accent uppercase tracking-wider">AI Analysis</h3>
                </div>
                <p className="text-text-primary font-medium leading-relaxed">
                    {insight || "Analyzing local atmospheric data..."}
                </p>
            </div>
        </div>
    );
};

export default AINsightCard;
