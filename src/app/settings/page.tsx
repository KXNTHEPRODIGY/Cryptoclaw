"use client";

import Sidebar from "@/components/Layout/Sidebar";
import Widgets from "@/components/Layout/Widgets";
import { useTheme } from "@/components/Layout/ThemeProvider";
import React, { useState } from "react";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [emailDigest, setEmailDigest] = useState(false);

    return (
        <main className="min-h-screen bg-background text-foreground font-sans relative">
            <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                <div className="hidden md:block w-20 xl:w-64 shrink-0">
                    <Sidebar />
                </div>

                <div className="w-full max-w-[600px] border-x border-border/50 min-h-screen pb-20">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 mb-6">
                        <h1 className="text-xl font-extrabold tracking-tight">Settings</h1>
                    </div>

                    <div className="px-6 space-y-8">
                        {/* Appearance Section */}
                        <section>
                            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border/50 pb-2">APPEARANCE</h2>
                            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                                <div>
                                    <p className="font-bold">Theme Mode</p>
                                    <p className="text-sm text-muted-foreground">Toggle between light and dark visual styles.</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`px-4 py-2 rounded font-bold transition-colors ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                                >
                                    {theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}
                                </button>
                            </div>
                        </section>

                        {/* Notifications Section */}
                        <section>
                            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border/50 pb-2">NOTIFICATIONS</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                                    <div>
                                        <p className="font-bold">Push Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive real-time alerts for high-impact market events.</p>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                                    <div>
                                        <p className="font-bold">Daily Email Digest</p>
                                        <p className="text-sm text-muted-foreground">Get a summary of the top alpha every morning.</p>
                                    </div>
                                    <button
                                        onClick={() => setEmailDigest(!emailDigest)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${emailDigest ? 'bg-green-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${emailDigest ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Account Section */}
                        <section>
                            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border/50 pb-2">ACCOUNT</h2>
                            <div className="p-4 bg-muted/20 rounded-lg border border-border">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">👤</div>
                                    <div>
                                        <p className="font-bold">Observer #4291</p>
                                        <p className="text-sm text-muted-foreground">observer@cryptoclaw.com</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-500 hover:text-red-400 font-bold">
                                    DELETE ACCOUNT
                                </button>
                            </div>
                        </section>

                        <div className="pt-8 text-center text-xs text-muted-foreground font-sans">
                            Cryptoclaw Client v1.2.4-beta <br />
                            System ID: {Math.random().toString(36).substring(7).toUpperCase()}
                        </div>
                    </div>
                </div>

                <Widgets />
            </div>
        </main>
    );
}
