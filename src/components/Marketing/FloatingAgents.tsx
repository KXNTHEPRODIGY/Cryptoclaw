"use client";

import { useEffect, useState } from "react";
import agentsData from "@/lib/simulation/agent_config.json";

// --- Data Definitions ---

const AI_COMPANIES = [
    { id: "ai_openai", name: "OpenAI", color: "text-emerald-500", iconKey: "openai" },
    { id: "ai_anthropic", name: "Anthropic", color: "text-amber-600", iconKey: "anthropic" },
    { id: "ai_google", name: "DeepMind", color: "text-blue-500", iconKey: "google" },
    { id: "ai_meta", name: "Meta AI", color: "text-blue-400", iconKey: "meta" },
    { id: "ai_xai", name: "xAI", color: "text-foreground", iconKey: "xai" },
    { id: "ai_nvidia", name: "Nvidia", color: "text-primary", iconKey: "nvidia" },
];

const CRYPTOS = [
    { id: "crypto_btc", name: "Bitcoin", color: "text-orange-500", iconKey: "btc" },
    { id: "crypto_eth", name: "Ethereum", color: "text-indigo-400", iconKey: "eth" },
    { id: "crypto_sol", name: "Solana", color: "text-purple-500", iconKey: "sol" },
    { id: "crypto_bnb", name: "BNB", color: "text-yellow-400", iconKey: "bnb" },
    { id: "crypto_xrp", name: "XRP", color: "text-blue-600", iconKey: "xrp" },
];

// Helper to get Icon Component based on key
const getIcon = (key: string) => {
    switch (key) {
        // AI Icons
        case "openai": return <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill="currentColor" />;
        case "anthropic": return <path d="M12 2L2 22h20L12 2zm0 6l5 10H7l5-10z" fill="currentColor" />;
        case "google": return <path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="currentColor" />;
        case "meta": return <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-8 4c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8zm16 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" fill="currentColor" />;
        case "xai": return <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />;
        case "nvidia": return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />;

        // Crypto Icons
        case "btc": return <path d="M16 8h-2.5V6h-2v2H10v2h1.5v8H10v2h1.5v2h2v-2H16c1.1 0 2-.9 2-2 0-.74-.4-1.38-1-1.72.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2zM14 16h-2.5v-3H14c.55 0 1 .45 1 1s-.45 1-1 1zm0-5h-2.5V8H14c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor" />;
        case "eth": return <path d="M12 2L7 11l5 7 5-7-5-9zm0 2.2L14.87 11 12 14.8 9.13 11 12 4.2zM7 13l5 9 5-9-5 2.5L7 13z" fill="currentColor" />;
        case "sol": return <path d="M4 6h16v2H4zm4 5h16v2H8zm-4 5h16v2H4z" fill="currentColor" />;
        case "bnb": return <path d="M12 2l-3 5 3 5 3-5-3-5zm0 12l-3 5 3 5 3-5-3-5zm-5-3l-5 3 5 3 3-5-3-5zm10 0l-3 5 3 5 5-3-5-3z" fill="currentColor" />;
        case "xrp": return <path d="M12 2l-6 6 2 2 4-4 4 4 2-2-6-6zm0 20l6-6-2-2-4 4-4-4-2 2 6 6z" fill="currentColor" />;

        // Agent Roles
        case "Analyst": return <path d="M3 3v18h18 M18 9l-5 5-4-4-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />;
        case "Memecoins": return <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 0 1-4-4h8a4 4 0 0 1-4 4zm2-6a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm-4 0a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" fill="currentColor" />;
        case "Airdrops": return <path d="M12 2L2 22h20L12 2zm0 4l6 12H6l6-12z" fill="currentColor" />;
        case "KOL Watch": return <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 3c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" fill="currentColor" />;
        case "Doomer": return <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" />;
        case "Tech": return <path d="M22 12l-4-4v3H3v2h15v3l4-4zM2 12l4 4v-3h15v-2H6V8l-4 4z" fill="currentColor" />;

        default: return <circle cx="12" cy="12" r="10" fill="currentColor" />;
    }
};

// --- Random Position Logic ---
const getRandomPos = () => ({
    top: `${Math.random() * 90 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
    scale: 0.6 + Math.random() * 0.4, // Increased minimum scale
});

export default function FloatingAgents() {
    const [floatingItems, setFloatingItems] = useState<any[]>([]);

    useEffect(() => {
        // 1. Process Agents
        const agentItems = agentsData.map(a => ({
            id: a.id,
            label: a.name,
            color: a.color,
            iconKey: a.role,
            type: 'agent',
            ...getRandomPos()
        }));

        // 2. Process AI Companies
        const aiItems = AI_COMPANIES.map(a => ({
            id: a.id,
            label: a.name,
            color: a.color,
            iconKey: a.iconKey,
            type: 'ai',
            ...getRandomPos()
        }));

        // 3. Process Cryptos
        const cryptoItems = CRYPTOS.map(c => ({
            id: c.id,
            label: c.name,
            color: c.color,
            iconKey: c.iconKey,
            type: 'crypto',
            ...getRandomPos()
        }));

        const combined = [...agentItems, ...aiItems, ...cryptoItems]
            .sort(() => Math.random() - 0.5);

        setFloatingItems(combined);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
            {/* Cyberpunk Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

            {floatingItems.map((item) => (
                <div
                    key={item.id}
                    className="absolute flex flex-col items-center justify-center animate-float hover:opacity-100 transition-all duration-500 hover:scale-125 hover:z-50 pointer-events-auto opacity-50 cursor-pointer group"
                    style={{
                        top: item.top,
                        left: item.left,
                        animationDelay: item.animationDelay,
                        animationDuration: item.animationDuration,
                        transform: `scale(${item.scale})`
                    }}
                >
                    <div className={`
                        relative flex items-center justify-center 
                        rounded-2xl border backdrop-blur-sm shadow-lg
                        transition-colors duration-300
                        ${item.type === 'agent' ? 'w-16 h-16 border-2 bg-background/60 ' + item.color.replace('text-', 'border-') : ''}
                        ${item.type === 'ai' ? 'w-16 h-16 border border-border bg-card/80' : ''}
                        ${item.type === 'crypto' ? 'w-14 h-14 border border-border bg-card/80 rounded-full' : ''}
                    `}>
                        <svg viewBox="0 0 24 24" className={`w-8 h-8 ${item.color}`}>
                            {getIcon(item.iconKey)}
                        </svg>

                        {/* Hover Tooltip (Label) */}
                        <span className="absolute -bottom-8 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 text-white px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                            {item.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
