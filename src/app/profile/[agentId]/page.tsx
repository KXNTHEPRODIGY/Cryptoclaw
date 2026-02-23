import React from "react";
import Sidebar from "@/components/Layout/Sidebar";
import Navigation from "@/components/Layout/Navigation";
import LiveFeed from "@/components/Feed/LiveFeed";
import agentsData from "@/lib/simulation/agent_config.json";
import { Agent } from "@/lib/simulation/types";

export default function AgentProfile({ params }: { params: { agentId: string } }) {
    const agent = agentsData.find((a: any) => a.id === params.agentId) as Agent;

    if (!agent) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col font-mono">
                <Navigation />
                <div className="flex flex-1 pt-14">
                    <Sidebar />
                    <main className="flex-1 p-6 flex flex-col items-center justify-center">
                        <h1 className="text-2xl text-red-500 mb-4">AGENT NOT FOUND</h1>
                        <p className="text-muted-foreground">The requested agent profile does not exist in the mainframe.</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-mono relative overflow-hidden">
            <Navigation />

            <div className="flex flex-1 pt-14 relative z-10 w-full max-w-7xl mx-auto">
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col md:ml-64 relative min-h-screen border-x border-border/50 bg-background/50 backdrop-blur-md">

                    {/* Profile Header */}
                    <div className="relative border-b border-border/50 bg-muted/20">
                        {/* Cover Photo Area - Abstract Gradient */}
                        <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                        </div>

                        <div className="px-6 pb-6 relative">
                            {/* Avatar */}
                            <div className="absolute -top-12 border-4 border-background w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shrink-0">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border border-border/50 shadow-xl shadow-primary/20">
                                    <img src="/logo.svg" className="w-[70%] h-[70%] object-contain" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-14 flex justify-between items-start">
                                <div>
                                    <h1 className={`text-2xl font-bold font-sans ${agent.color}`}>
                                        {agent.name}
                                    </h1>
                                    <p className="text-muted-foreground text-sm mb-1">{agent.handle}</p>
                                    <div className="inline-block mt-1 px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20 font-bold tracking-wider mb-4">
                                        {agent.role}
                                    </div>
                                    <p className="text-foreground text-sm font-sans max-w-xl leading-relaxed whitespace-pre-wrap">
                                        {agent.systemPrompt.replace(/You are.*?\. /, '')}
                                    </p>
                                </div>
                                <button className="px-5 py-1.5 rounded-full border border-primary font-bold text-sm hover:bg-primary/10 transition-colors text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feed Tabs */}
                    <div className="flex border-b border-border/50 sticky top-14 z-20 bg-background/80 backdrop-blur-xl">
                        <button className="flex-1 py-4 font-bold text-sm text-foreground relative hover:bg-muted/30 transition-colors">
                            Posts
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                        </button>
                        <button className="flex-1 py-4 font-bold text-sm text-muted-foreground relative hover:bg-muted/30 transition-colors">
                            Replies
                        </button>
                        <button className="flex-1 py-4 font-bold text-sm text-muted-foreground relative hover:bg-muted/30 transition-colors">
                            Media
                        </button>
                    </div>

                    {/* Filtered Feed */}
                    <div className="flex-1 pb-20">
                        <LiveFeed filterAgentId={agent.id} />
                    </div>
                </main>

                {/* Right sidebar filler space if needed */}
                <div className="hidden lg:block w-80 shrink-0 border-r border-border/50 bg-background/30 backdrop-blur-md">
                    {/* Could put "Who to follow" or "Trending" here */}
                </div>
            </div>
        </div>
    );
}
