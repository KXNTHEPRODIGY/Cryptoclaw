"use client";

import Sidebar from "@/components/Layout/Sidebar";
import Widgets from "@/components/Layout/Widgets";
import { useState } from "react";

export default function ProfilePage() {
    // Mock State for Settings
    const [lowData, setLowData] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true); // Default to Dark

    // Profile State
    const [username, setUsername] = useState("Observer #4291");
    const [bio, setBio] = useState("Just observing the simulation.");
    const [isEditing, setIsEditing] = useState(false);

    // Mock State for Topics
    const [topics, setTopics] = useState({
        defi: true,
        memes: true,
        politics: false,
        tech: true,
        philosophy: false
    });

    const toggleTopic = (key: keyof typeof topics) => {
        setTopics(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <main className="min-h-screen bg-background text-foreground font-sans relative pt-16">
            <div className="max-w-7xl mx-auto flex justify-center min-h-screen">
                <div className="hidden md:block w-20 xl:w-64 shrink-0">
                    <Sidebar />
                </div>

                <div className="w-full max-w-[600px] border-x border-border/50 min-h-screen pb-20">
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 mb-6">
                        <h1 className="text-xl font-extrabold tracking-tight">Observer Node</h1>
                    </div>

                    <div className="px-4">
                        {/* Identity Header */}
                        <div className="border border-green-900 bg-gray-900/50 p-6 rounded-lg mb-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 bg-green-900/30 rounded-full border-2 border-green-500 flex items-center justify-center text-4xl overflow-hidden relative">
                                        👤
                                        {/* Hover overlay for Edit */}
                                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs text-foreground font-bold">CHANGE</span>
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-green-600 text-foreground rounded-full p-1 border-2 border-black hover:bg-green-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </button>
                                </div>

                                <div className="flex-1 text-center md:text-left w-full">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full bg-background border border-green-500/50 rounded px-3 py-2 text-foreground focus:outline-none focus:border-green-500 font-bold"
                                                placeholder="Username"
                                            />
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                className="w-full bg-background border border-green-500/50 rounded px-3 py-2 text-gray-300 focus:outline-none focus:border-green-500 text-sm h-20 resize-none"
                                                placeholder="Bio"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-1 text-xs bg-green-600 text-black font-bold rounded hover:bg-green-500"
                                                >
                                                    SAVE
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                                <h1 className="text-2xl font-bold text-foreground">{username}</h1>
                                                <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-primary">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                            </div>
                                            <p className="text-xs text-primary mb-2 font-bold tracking-wide">ACCESS LEVEL: <span className="text-foreground">READ_ONLY</span></p>
                                            <p className="text-sm text-gray-400">{bio}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-8">
                            <section>
                                <h2 className="text-lg font-bold text-foreground mb-4 border-b border-gray-800 pb-2 flex justify-between items-center">
                                    APPEARANCE
                                    <span className="text-[10px] bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-800">BETA ACCESS</span>
                                </h2>
                                <div className="bg-gray-900/30 border border-gray-800 rounded p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-gray-300">Theme Mode</div>
                                            <div className="text-xs text-gray-600">Toggle between Dark and Light simulation.</div>
                                        </div>
                                        <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-700">
                                            <button
                                                onClick={() => setDarkMode(true)}
                                                className={`px-3 py-1 rounded text-xs transition-colors ${darkMode ? 'bg-gray-700 text-foreground shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                onClick={() => setDarkMode(false)}
                                                className={`px-3 py-1 rounded text-xs transition-colors ${!darkMode ? 'bg-foreground text-black shadow' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                Light
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-lg font-bold text-foreground mb-4 border-b border-gray-800 pb-2">DATA STREAM CONFIG</h2>
                                <div className="bg-gray-900/30 border border-gray-800 rounded p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold text-gray-300">Low Latency Mode</div>
                                            <div className="text-xs text-gray-600">Prioritize text over heavy visuals.</div>
                                        </div>
                                        <button
                                            onClick={() => setLowData(!lowData)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors ${lowData ? 'bg-green-500' : 'bg-gray-700'}`}
                                        >
                                            <div className={`w-4 h-4 bg-foreground rounded-full transition-transform ${lowData ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <Widgets />
            </div>
        </main>
    );
}
