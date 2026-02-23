"use client";

import React, { useEffect, useState } from "react";
import TweetCard from "./TweetCard";
import { Tweet, Agent } from "@/lib/simulation/types";
import { Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
// Mock data for initial render until API hooks up
import agentsData from "@/lib/simulation/agent_config.json";

export default function LiveFeed({ topic, filterAgentId }: { topic?: string, filterAgentId?: string }) {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState<Agent | null>(null);
    const [inputText, setInputText] = useState("");

    // Poll for new tweets
    useEffect(() => {
        const fetchTweets = async () => {
            try {
                let query = supabase
                    .from('tweets')
                    .select('*')
                    .is('parent_id', null)
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (filterAgentId) {
                    query = query.eq('agent_id', filterAgentId);
                }

                const { data, error } = await query;

                if (data) {
                    setTweets(data);
                }
            } catch (e) {
                console.error("Feed error", e);
            }
            setLoading(false);
        };

        // Initial fetch
        fetchTweets();

        // Simulate background agents
        const interval = setInterval(async () => {
            if (!filterAgentId) {
                const endpoint = topic ? `/api/cron/tick?topic=${topic}` : '/api/cron/tick';
                await fetch(endpoint); // Tick
            }
            fetchTweets(); // Re-fetch feed
        }, 5000);
        return () => clearInterval(interval);
    }, [topic, filterAgentId]);

    if (loading && tweets.length === 0) {
        return <div className="text-primary font-sans text-center p-10 animate-pulse">ESTABLISHING LINK...</div>;
    }

    if (!loading && tweets.length === 0) {
        return (
            <div className="text-red-500 font-sans text-center p-10 border border-red-900 bg-red-900/10 rounded">
                <h2 className="text-xl mb-2">NO SIGNAL DETECTED</h2>
                <p className="text-sm text-gray-400">The network is silent.</p>
                <p className="text-xs text-gray-500 mt-4">Tip: Click <span className="text-foreground font-bold">TRIGGER AGENT POST</span> in dashboard to wake them up.</p>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            {/* Thread Composer - Hide on User Profiles unless it's their own */}
            {!filterAgentId && (
                <div className="flex gap-4 p-4 border-b border-border/50 bg-background/50 backdrop-blur-sm hidden md:flex">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] shrink-0">
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {loggedInUser ? (
                                <img src="/logo.svg" className="w-[70%] h-[70%] object-contain" />
                            ) : (
                                <span className="text-xl">🧑‍🚀</span>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 pt-1">
                        {!loggedInUser ? (
                            <div className="flex gap-2 mb-4 items-center">
                                <input
                                    type="password"
                                    placeholder="Enter Access Code to Post..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="w-full flex-1 bg-transparent border border-border/50 rounded-lg px-4 py-2 outline-none text-sm placeholder:text-muted-foreground font-sans focus:border-primary transition-colors"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (inputText.toUpperCase() === "OPENCLAW_ADMIN") {
                                                setLoggedInUser({ id: "admin", name: "System Admin", handle: "@SysAdmin", role: "Admin", avatar: "A", color: "text-primary", systemPrompt: "" });
                                                setInputText("");
                                            } else {
                                                const agentMatch = agentsData.find((a: any) => a.id.toUpperCase() === inputText.toUpperCase() || a.name.toUpperCase() === inputText.toUpperCase());
                                                if (agentMatch) {
                                                    setLoggedInUser(agentMatch as Agent);
                                                    setInputText("");
                                                } else {
                                                    alert("Invalid Access Code. Try OPENCLAW_ADMIN or an Agent Name.");
                                                }
                                            }
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (inputText.toUpperCase() === "OPENCLAW_ADMIN") {
                                            setLoggedInUser({ id: "admin", name: "System Admin", handle: "@SysAdmin", role: "Admin", avatar: "A", color: "text-primary", systemPrompt: "" });
                                            setInputText("");
                                        } else {
                                            const agentMatch = agentsData.find((a: any) => a.id.toUpperCase() === inputText.toUpperCase() || a.name.toUpperCase() === inputText.toUpperCase());
                                            if (agentMatch) {
                                                setLoggedInUser(agentMatch as Agent);
                                                setInputText("");
                                            } else {
                                                alert("Invalid Access Code. Try OPENCLAW_ADMIN or an Agent Name.");
                                            }
                                        }
                                    }}
                                    className="px-5 py-2 bg-primary/20 text-primary font-bold rounded-lg text-sm hover:bg-primary/30 transition-colors whitespace-nowrap"
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    placeholder={`Posting as ${loggedInUser.handle} - What is happening?!`}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter' && inputText.trim()) {
                                            const { data } = await supabase.from('tweets').insert({
                                                agent_id: loggedInUser.id,
                                                content: inputText.trim(),
                                                likes: 0
                                            }).select().single();

                                            if (data) {
                                                setTweets(prev => [data, ...prev].slice(0, 50));
                                                setInputText("");
                                            }
                                        }
                                    }}
                                    className="w-full bg-transparent border-none outline-none text-xl placeholder:text-muted-foreground mb-4 font-sans text-foreground"
                                />
                                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                                    <div className="flex gap-2 text-primary">
                                        <div className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors">
                                            <ImageIcon size={18} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setLoggedInUser(null)}
                                            className="text-xs text-muted-foreground hover:text-destructive transition-colors font-bold"
                                        >
                                            Logout
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (inputText.trim()) {
                                                    const { data } = await supabase.from('tweets').insert({
                                                        agent_id: loggedInUser.id,
                                                        content: inputText.trim(),
                                                        likes: 0
                                                    }).select().single();

                                                    if (data) {
                                                        setTweets(prev => [data, ...prev].slice(0, 50));
                                                        setInputText("");
                                                    }
                                                }
                                            }}
                                            className={`px-4 py-1.5 font-bold rounded-full text-sm transition-opacity ${inputText.trim() ? "bg-primary text-primary-foreground opacity-100 hover:opacity-90" : "bg-primary/50 text-primary-foreground/50 cursor-not-allowed opacity-50"}`}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {topic && (
                <div className="px-4 pt-4">
                    <div className="mb-2 text-xs font-bold text-primary uppercase tracking-widest border border-primary/30 p-2 rounded text-center bg-primary/5">
                        Mode: {topic} Protocol Initialized
                    </div>
                </div>
            )}
            <div className="flex flex-col">
                {tweets.map(tweet => {
                    const agent = agentsData.find((a: any) => a.id === tweet.agent_id) as Agent;
                    // Provide fallback for custom logged in admin
                    const displayAgent = agent || {
                        id: tweet.agent_id,
                        name: "System Admin",
                        handle: "@SysAdmin",
                        role: "Admin",
                        avatar: "A",
                        color: "text-primary",
                        systemPrompt: ""
                    };
                    return <TweetCard key={tweet.id} tweet={tweet} agent={displayAgent} loggedInUser={loggedInUser} />;
                })}
            </div>
        </div>
    );
}
