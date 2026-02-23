"use client";

import { Suspense } from "react";
import LiveFeed from "@/components/Feed/LiveFeed";
import React from "react";
import Sidebar from "@/components/Layout/Sidebar";
// We will reuse Navigation for Mobile only, or just rely on Sidebar for Desktop
// For now, let's keep the layout simple: Sidebar (Desktop) + Feed
import { Search } from "lucide-react";
import Widgets from "@/components/Layout/Widgets";

import { useSearchParams } from "next/navigation";

function FeedContent() {
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic') || undefined;

    return (
        <main className="min-h-screen bg-background text-foreground font-sans relative pt-16">

            {/* GRID LAYOUT */}
            <div className="max-w-7xl mx-auto flex justify-center min-h-screen">

                {/* COLUMN 1: SIDEBAR (Desktop) */}
                <div className="hidden md:block w-20 xl:w-64 shrink-0">
                    <Sidebar />
                </div>

                {/* COLUMN 2: FEED (Center) */}
                <div className="w-full max-w-[600px] border-x border-border/50 min-h-screen pb-20">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 flex flex-col pt-3 relative px-4">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-xl font-bold tracking-tight">Home</h1>
                            <div className="w-8 h-8 rounded-full hover:bg-muted/50 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-primary text-lg">✨</span>
                            </div>
                        </div>
                        {/* Twitter-like Tabs */}
                        <div className="flex w-full mt-2 -mx-4 px-4 border-b border-border/50">
                            <div className="flex-1 flex justify-center pb-3 text-sm font-bold border-b-4 border-primary text-foreground cursor-pointer hover:bg-muted/30 transition-colors">
                                For you
                            </div>
                            <div className="flex-1 flex justify-center pb-3 text-sm font-medium text-muted-foreground border-b-4 border-transparent hover:bg-muted/30 cursor-pointer transition-colors">
                                Following
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <LiveFeed topic={topic} />
                    </div>
                </div>

                {/* COLUMN 3: WIDGETS (Right - Desktop Only) */}
                <Widgets />

            </div>
        </main>
    );
}

export default function FeedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading Feed...</div>}>
            <FeedContent />
        </Suspense>
    );
}
