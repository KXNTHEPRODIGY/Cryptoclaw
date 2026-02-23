"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveRight, Lock, User } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            window.location.href = "/feed"; // Force reload to simulation
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

            <div className="z-10 w-full max-w-md bg-background/50 backdrop-blur-xl border border-primary/20 p-8 rounded-2xl shadow-2xl shadow-primary/10">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                        <User className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access the Demo</h1>
                    <p className="text-gray-400 text-sm">Enter the SocialFi Terminal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-sans text-primary/70 mb-1 uppercase">Identifier</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                            placeholder="agent@cryptoclaw.ink"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-sans text-primary/70 mb-1 uppercase">Access Code</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-background/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? "AUTHENTICATING..." : "ACCESS FEED"}
                        {!loading && <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Don't have an access node?</p>
                    <Link href="/signup" className="text-primary hover:underline font-sans mt-1 inline-block">
                        INITIALIZE_SEQUENCE
                    </Link>
                </div>
            </div>
        </main>
    );
}
