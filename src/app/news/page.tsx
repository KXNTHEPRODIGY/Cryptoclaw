"use client";

import Sidebar from "@/components/Layout/Sidebar";
import Widgets from "@/components/Layout/Widgets";
import { useEffect, useState } from "react";

interface NewsItem {
    headline: string;
    url: string;
    summary: string;
    source: string;
    imageUrl?: string | null;
}

interface MarketData {
    lastUpdated: number;
    headlines: string[];
    richData?: NewsItem[];
    sentiment: string;
}

export default function NewsPage() {
    const [data, setData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/market')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch market data", err);
                setLoading(false);
            });
    }, []);

    const newsItems: NewsItem[] = data?.richData || data?.headlines.map(h => ({
        headline: h,
        url: '#',
        summary: '',
        source: 'Unknown'
    })) || [];

    return (
        <main className="min-h-screen bg-background text-foreground font-sans relative pt-16">
            <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                <div className="hidden md:block w-20 xl:w-64 shrink-0">
                    <Sidebar />
                </div>

                <div className="w-full max-w-[600px] border-x border-border/50 min-h-screen pb-20">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 mb-6">
                        <h1 className="text-xl font-extrabold tracking-tight">Crypto News</h1>
                    </div>

                    <div className="px-4">
                        <div className="mb-8 border-b border-border pb-4 flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight mb-1 text-primary">LATEST WIRES</h1>
                                <p className="text-muted-foreground text-sm">Real-time updates from professional sources.</p>
                            </div>
                            {data && (
                                <div className="text-xs text-muted-foreground text-right">
                                    UPDATED: {new Date(data.lastUpdated).toLocaleTimeString()}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-primary animate-pulse">Scanning wires...</div>
                            ) : (
                                newsItems.map((item, i) => (
                                    <div key={i} className="bg-card border border-border p-5 rounded-lg hover:border-primary/50 transition-colors group shadow-sm flex flex-col md:flex-row gap-6">
                                        {/* Image (if available) */}
                                        {item.imageUrl && (
                                            <div className="w-full md:w-48 h-32 shrink-0 rounded-md overflow-hidden bg-muted border border-border">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.headline}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    onError={(e) => {
                                                        // Hide image on error
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                                                    {item.source.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-muted-foreground">Just now</span>
                                            </div>
                                            <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {item.headline}
                                            </h2>
                                            {item.summary && <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{item.summary}</p>}

                                            <div className="flex items-center justify-between border-t border-border pt-4">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1 text-blue-500">
                                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                                        Verified Source
                                                    </span>
                                                </div>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-xs font-bold px-4 py-2 rounded-md transition-colors flex items-center gap-1 ${item.url === '#' ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                                                >
                                                    READ SOURCE ↗
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {newsItems.length === 0 && !loading && (
                                <div className="text-muted-foreground">No headlines found. Check fetcher status.</div>
                            )}
                        </div>
                    </div>
                </div>

                <Widgets />
            </div>
        </main>
    );
}
