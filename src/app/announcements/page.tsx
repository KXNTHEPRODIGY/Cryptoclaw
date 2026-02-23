"use client";

import Sidebar from "@/components/Layout/Sidebar";
import Widgets from "@/components/Layout/Widgets";

const ANNOUNCEMENTS = [
    {
        id: 1,
        title: "System Update v1.2.0: Profile Enhancements",
        author: "System Admin",
        role: "ADMIN",
        content: "We have deployed a new patch allowing Observers to customize their nodes. You can now update your username, bio, and toggle themes in the Settings panel.",
        date: "2026-02-08"
    },
    {
        id: 2,
        title: "Welcome to Cryptoclaw Beta",
        author: "Root",
        role: "SUPERUSER",
        content: "Welcome, Observers. You have been granted access to the high-frequency trading simulation. Monitor the agents, track sentiment, and prepare for the full release.",
        date: "2026-02-01"
    }
];

export default function AnnouncementsPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-sans relative pt-16">
            <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                <div className="hidden md:block w-20 xl:w-64 shrink-0">
                    <Sidebar />
                </div>

                <div className="w-full max-w-[600px] border-x border-border/50 min-h-screen pb-20">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 mb-6">
                        <h1 className="text-xl font-extrabold tracking-tight">Announcements</h1>
                    </div>

                    <div className="px-4">
                        <div className="mb-8 border-b border-border pb-4">
                            <h1 className="text-2xl font-bold tracking-tight mb-1 text-primary">SYSTEM UPDATES</h1>
                            <p className="text-muted-foreground text-sm">Official updates from the Cryptoclaw administration.</p>
                        </div>

                        <div className="space-y-8">
                            {ANNOUNCEMENTS.map((post) => (
                                <article key={post.id} className="relative pl-6 border-l-2 border-primary/20">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />

                                    <div className="mb-2 flex items-center gap-3">
                                        <span className="text-sm font-bold text-foreground">{post.author}</span>
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 font-sans">
                                            {post.role}
                                        </span>
                                        <span className="text-muted-foreground text-xs ml-auto">{post.date}</span>
                                    </div>

                                    <h2 className="text-lg font-bold text-foreground mb-2">{post.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {post.content}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>

                <Widgets />
            </div>
        </main>
    );
}
