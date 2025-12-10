import React, { useState } from 'react';
import { Search, MapPin, Leaf } from 'lucide-react';

interface HeaderProps {
    onSearch: (query: string) => void;
    locationName: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, locationName }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
        setSearchQuery('');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-navy-border bg-navy-main/90 backdrop-blur-xl shadow-navy">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo Area */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20 duration-500 group-hover:scale-105 group-hover:shadow-brand-primary/40">
                        <Leaf className="h-6 w-6 text-navy-main" />
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-text-primary">
                            Eco<span className="text-brand-primary">Guard</span>
                        </h1>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
                            AI Environmental Monitor
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSubmit} className="relative hidden w-96 md:block group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-text-muted group-focus-within:text-brand-accent transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search city or coordinates..."
                        className="block w-full rounded-xl border border-navy-border bg-navy-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-primary focus:bg-navy-surface focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-inner transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="flex gap-1">
                            {['Cmd', 'K'].map((k) => (
                                <kbd key={k} className="hidden rounded bg-navy-main px-1.5 py-0.5 text-[10px] font-bold text-text-muted shadow-sm border border-navy-border lg:inline-block">
                                    {k}
                                </kbd>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden text-right md:block">
                        <div className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
                            <MapPin className="h-3 w-3 text-brand-primary" />
                            <span>Current Location</span>
                        </div>
                        <p className="text-sm font-bold text-text-primary max-w-[150px] truncate">
                            {locationName || "Select Location"}
                        </p>
                    </div>

                    <button className="relative ml-2 flex h-10 w-10 items-center justify-center rounded-xl border border-navy-border bg-navy-surface text-text-secondary shadow-sm transition-all hover:bg-navy-main hover:text-brand-accent hover:border-brand-accent hover:-translate-y-0.5">
                        <Search className="h-5 w-5 md:hidden" />
                        <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(111,255,233,0.5)] animate-pulse md:hidden"></div>
                        <Leaf className="h-5 w-5 hidden md:block" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
