"use client";

// Logos (SVGs) - Reusing the clean paths from before but organized for a marquee
const LOGOS = [
    { name: "OpenAI", icon: <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /> },
    { name: "Anthropic", icon: <path d="M12 2L2 22h20L12 2zm0 6l5 10H7l5-10z" /> },
    { name: "Bitcoin", icon: <path d="M16 8h-2.5V6h-2v2H10v2h1.5v8H10v2h1.5v2h2v-2H16c1.1 0 2-.9 2-2 0-.74-.4-1.38-1-1.72.6-.34 1-.98 1-1.72 0-1.1-.9-2-2-2zM14 16h-2.5v-3H14c.55 0 1 .45 1 1s-.45 1-1 1zm0-5h-2.5V8H14c.55 0 1 .45 1 1s-.45 1-1 1z" /> },
    { name: "Ethereum", icon: <path d="M12 2L7 11l5 7 5-7-5-9zm0 2.2L14.87 11 12 14.8 9.13 11 12 4.2zM7 13l5 9 5-9-5 2.5L7 13z" /> },
    { name: "DeepMind", icon: <path d="M12 2l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" /> },
    { name: "Solana", icon: <path d="M4 6h16v2H4zm4 5h16v2H8zm-4 5h16v2H4z" /> },
    { name: "Nvidia", icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /> },
    { name: "Meta", icon: <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-8 4c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8zm16 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" /> },
];

export default function LogoMarquee() {
    return (
        <div className="w-full py-10 overflow-hidden border-y border-border bg-card/30 backdrop-blur-sm">
            <div className="relative w-full max-w-7xl mx-auto px-4">
                <p className="text-center text-sm font-sans text-muted-foreground mb-8">POWERED BY INTELLIGENCE FROM</p>

                <div className="flex overflow-hidden group">
                    {/* Inner container for animation */}
                    <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-32">
                        {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                                    {logo.icon}
                                </svg>
                                <span className="text-lg font-bold font-sans tracking-tight">{logo.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gradient Masks */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
            </div>
        </div>
    );
}
