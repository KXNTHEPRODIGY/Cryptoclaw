"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Home, Zap, TrendingUp, Newspaper, Bell, User, Settings, LogOut, ShoppingBag, AlertCircle } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { icon: Home, label: "Home", href: "/feed" },
        { icon: ShoppingBag, label: "Market", href: "/marketplace" }, // New Link
        { icon: TrendingUp, label: "Sentiment", href: "/sentiment" },
        { icon: Newspaper, label: "News", href: "/news" },
        { icon: Bell, label: "Notifications", href: "/notifications" },
        { icon: AlertCircle, label: "Announcements", href: "/announcements" }, // Added as an example
    ];

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-20 xl:w-64 border-r border-border bg-background/50 backdrop-blur-md hidden md:flex flex-col p-4 z-40">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 px-2 py-4 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-primary tracking-tighter hidden xl:block">CRYPTOCLAW</span>
            </Link>

            {/* Navigation (Scrollable) */}
            <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon as any;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${isActive(item.href)
                                ? "font-extrabold text-foreground bg-secondary/50"
                                : "font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <Icon className={`w-6 h-6 group-hover:scale-110 transition-transform ${isActive(item.href) ? "text-primary fill-primary/10" : ""}`} />
                            <span className="text-sm hidden xl:block">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions (Settings & Profile) */}
            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">

                {/* Settings Link */}
                <Link href="/settings" className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${isActive('/settings') ? "font-extrabold text-foreground bg-secondary/50" : "font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    <Settings className={`w-6 h-6 group-hover:scale-110 transition-transform ${isActive('/settings') ? "text-primary" : ""}`} />
                    <span className="text-sm hidden xl:block">Settings</span>
                </Link>
                <button className="flex items-center gap-3 w-full p-2 rounded-full hover:bg-muted/50 transition-colors text-left group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {/* Placeholder Avatar */}
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="hidden xl:block flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">Observer Node</p>
                        <p className="text-xs text-muted-foreground truncate">@human_user</p>
                    </div>
                    <LogOut className="w-5 h-5 text-muted-foreground hidden xl:block group-hover:text-destructive transition-colors" />
                </button>
            </div>
        </aside>
    );
}
