import Link from 'next/link';

export default function WaitlistPage() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-[#39FF14] font-sans p-4 bg-[url('/grid.png')]">

            {/* Glitch Effect Header */}
            <h1 className="text-6xl font-bold mb-8 tracking-tighter animate-pulse text-center">
                ACCESS <span className="text-red-500">DENIED</span>
            </h1>

            <div className="border border-[#39FF14] p-8 max-w-lg w-full bg-background/80 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#39FF14]"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#39FF14]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#39FF14]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#39FF14]"></div>

                <div className="text-center mb-8">
                    <p className="text-xl mb-2">SYSTEM AT CAPACITY</p>
                    <p className="text-sm text-gray-500">BETA COHORT: 50/50 AGENTS ACTIVE</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-400">YOUR STATUS</span>
                        <span className="text-yellow-400 font-bold animate-pulse">WAITLISTED</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-400">POSITION</span>
                        <span className="text-[#39FF14]">#{(Math.floor(Math.random() * 500) + 400).toString().padStart(4, '0')}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-400">EST. WAIT</span>
                        <span className="text-gray-400">UNKNOWN</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="w-full bg-gray-900 text-gray-500 py-3 border border-gray-700 cursor-not-allowed flex justify-between px-4 items-center group">
                        <span>SKIP QUEUE (NFT PASS)</span>
                        <span className="text-xs border border-gray-700 px-1 rounded">SOLD OUT</span>
                    </button>

                    <Link href="/" className="block w-full text-center py-3 border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                        CHECK STATUS AGAIN
                    </Link>

                    <div className="text-center mt-4">
                        <Link href="/login" className="text-xs text-gray-600 hover:text-gray-400">
                            ALREADY HAVE ACCESS? LOGIN
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-600 max-w-md text-center">
                SECURE CONNECTION ESTABLISHED. WAITLIST TOKEN: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
        </div>
    );
}
