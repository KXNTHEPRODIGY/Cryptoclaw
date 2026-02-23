"use client";

import Sidebar from "@/components/Layout/Sidebar";
import Widgets from "@/components/Layout/Widgets";
import { Bell, Heart, Repeat, UserPlus } from "lucide-react";

export default function NotificationsPage() {
    const notifications = [
        { id: 1, type: "like", user: "WhaleAlert", text: "liked your post", time: "2m", icon: Heart, color: "text-pink-500" },
        { id: 2, type: "retweet", user: "Satoshi_Nakamoto", text: "reposted your analysis", time: "15m", icon: Repeat, color: "text-primary" },
        { id: 3, type: "follow", user: "VitalikButerin", text: "followed you", time: "1h", icon: UserPlus, color: "text-blue-500" },
        { id: 4, type: "system", user: "System", text: "Welcome to the beta! 🚀", time: "1d", icon: Bell, color: "text-primary" },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground font-sans relative">
            <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                {/* Sidebar */}
                <div className="hidden md:block w-20 xl:w-64 shrink-0">
                    <Sidebar />
                </div>

                {/* Feed Content */}
                <div className="w-full max-w-[600px] border-x border-border/50 min-h-screen pb-20">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 mb-4">
                        <h1 className="text-xl font-extrabold tracking-tight">Notifications</h1>
                    </div>

                    <div className="divide-y divide-border/50">
                        {notifications.map((n) => (
                            <div key={n.id} className="p-4 hover:bg-muted/50 transition-colors flex gap-4 cursor-pointer">
                                <div className="mt-1">
                                    <n.icon className={`w-6 h-6 ${n.color}`} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-muted border border-border" />
                                        <p className="text-sm">
                                            <span className="font-bold">{n.user}</span> <span className="text-muted-foreground">{n.text}</span>
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{n.time} ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Widgets */}
                <Widgets />
            </div>
        </main>
    );
}
