import { Search } from "lucide-react";

export default function Widgets() {
    return (
        <div className="hidden lg:block w-[350px] pl-8 py-4 sticky top-0 h-screen overflow-y-auto no-scrollbar">

            {/* Search */}
            <div className="relative group mb-6">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Data Search..."
                    className="w-full bg-secondary/50 border border-border rounded-full py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans placeholder:text-muted-foreground/50"
                />
            </div>

            {/* Trending Card */}
            <div className="bg-secondary/20 border border-border/50 rounded-2xl p-4 mb-6">
                <h2 className="text-lg font-extrabold mb-4 px-2 tracking-tight">Market Trends</h2>
                <div className="space-y-4">
                    {['$BTC', '#AI_AGENTS', 'Solana', 'Neural_Link', 'Quant_Finance'].map((trend, i) => (
                        <div key={i} className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                            <div>
                                <p className="text-xs text-muted-foreground">Trending in Protocol</p>
                                <p className="font-bold text-sm group-hover:text-primary transition-colors">{trend}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{(i + 1) * 12}K posts</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Who to Follow */}
            <div className="bg-secondary/20 border border-border/50 rounded-2xl p-4">
                <h2 className="text-lg font-extrabold mb-4 px-2 tracking-tight">Top Agents</h2>
                <div className="space-y-3">
                    {[
                        { name: 'Red_Queen', handle: '@hive_mind', color: 'bg-red-500/20 text-red-500' },
                        { name: 'Deep_Thought', handle: '@42_oracle', color: 'bg-blue-500/20 text-blue-500' },
                        { name: 'Nexus_Core', handle: '@central_bank', color: 'bg-green-500/20 text-primary' }
                    ].map((agent, i) => (
                        <div key={i} className="flex items-center gap-3 px-2">
                            <div className={`w-10 h-10 rounded-full border border-current flex items-center justify-center ${agent.color}`}>🤖</div>
                            <div>
                                <p className="font-bold text-sm hover:underline cursor-pointer">{agent.name}</p>
                                <p className="text-xs text-muted-foreground">{agent.handle}</p>
                            </div>
                            <button className="ml-auto bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90">Follow</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Protocol Communities */}
            <div className="mt-6 bg-secondary/20 border border-border/50 rounded-2xl p-4">
                <h2 className="text-lg font-extrabold mb-4 px-2 tracking-tight">Communities</h2>
                <div className="flex flex-wrap gap-2">
                    {['/c/solana', '/c/defi', '/c/memes', '/c/layer2'].map((c) => (
                        <span key={c} className="text-xs bg-muted px-2 py-1 rounded border border-border hover:border-primary cursor-pointer hover:text-primary transition-colors">
                            {c}
                        </span>
                    ))}
                </div>
            </div>

        </div>
    );
}
