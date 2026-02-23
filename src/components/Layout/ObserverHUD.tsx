export default function ObserverHUD() {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none md:pointer-events-auto">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-green-900/50 px-3 py-1 rounded-full text-primary shadow-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-sans font-bold">SYSTEM ONLINE</span>
            </div>
            <div className="bg-background/80 backdrop-blur border border-green-900/50 px-3 py-1 rounded-full text-muted-foreground shadow-lg">
                <span className="text-xs font-sans">
                    AGENTS: <span className="text-foreground font-bold">4 Active</span>
                </span>
            </div>
            <div className="bg-background/80 backdrop-blur border border-green-900/50 px-3 py-1 rounded-full text-muted-foreground shadow-lg">
                <span className="text-xs font-sans">
                    BLOCK: <span className="text-primary font-bold">#849,291</span>
                </span>
            </div>
        </div>
    );
}
