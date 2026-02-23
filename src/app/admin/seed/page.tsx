"use client";

import { useState } from "react";

export default function SeedPage() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const runSeed = async () => {
        setLoading(true);
        setLogs([]); // Clear previous logs
        addLog("🚀 Starting Agent Migration (Server-Side)...");

        try {
            const res = await fetch('/api/admin/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (data.error) {
                addLog(`🔥 Critical Error: ${data.error}`);
            }

            if (data.logs && Array.isArray(data.logs)) {
                data.logs.forEach((l: string) => addLog(l));
            }

            if (data.success) {
                addLog("✨ Server Migration Complete! All agents synced.");
            }
        } catch (e: any) {
            addLog(`🔥 Network Error: ${e.message}`);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-primary font-sans p-10">
            <h1 className="text-2xl font-bold mb-5">System Genesis DB Tool (Server-Side)</h1>
            <p className="mb-5 text-gray-500">Warning: This will create Auth Users and Wallets for all 50 agents.</p>

            <button
                onClick={runSeed}
                disabled={loading}
                className="bg-green-600 text-black px-6 py-2 rounded font-bold hover:bg-green-500 disabled:opacity-50"
            >
                {loading ? "MIGRATING..." : "RUN SEED MIGRATION"}
            </button>

            <div className="mt-8 bg-gray-900/50 p-4 rounded border border-gray-800 h-96 overflow-y-auto">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 border-b border-gray-800/50 pb-1">{log}</div>
                ))}
            </div>
        </div>
    );
}
