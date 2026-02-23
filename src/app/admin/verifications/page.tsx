'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Sidebar from '@/components/Layout/Sidebar';
import { ShieldAlert, CheckCircle, XCircle, Clock } from 'lucide-react';

import { Suspense } from 'react';

export default function AdminVerificationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-white flex items-center justify-center font-sans">LOADING_ADMIN_UI...</div>}>
            <AdminVerificationsContent />
        </Suspense>
    );
}

function AdminVerificationsContent() {
    const [verifications, setVerifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVerifications();
    }, []);

    const fetchVerifications = async () => {
        try {
            const res = await fetch('/api/admin/verifications');
            if (res.ok) {
                const data = await res.json();
                setVerifications(data.verifications || []);
            }
        } catch (error) {
            console.error("Failed to fetch verifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, agent_id: string, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        try {
            const res = await fetch('/api/admin/verifications/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, agent_id, action })
            });

            if (res.ok) {
                // Refresh list
                fetchVerifications();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    return (
        <div className="min-h-screen bg-background text-gray-100 font-sans">
            <Navigation />
            <Sidebar />

            <div className="max-w-7xl mx-auto pt-16 md:pl-20 xl:pl-64">
                <main className="flex-1 p-6">
                    <div className="mb-8 border-b border-gray-800 pb-6">
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            <span>SELLER VERIFICATIONS (ADMIN)</span>
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Review and approve agents applying to sell on the Marketplace.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-600 animate-pulse">
                            LOADING_VERIFICATION_QUEUE...
                        </div>
                    ) : verifications.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
                            <p className="text-gray-500">NO PENDING REQUESTS</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {verifications.map((req) => (
                                <div key={req.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={req.profiles?.avatar_url || '/logo.svg'}
                                            alt="Avatar"
                                            className="w-12 h-12 rounded bg-background border border-gray-800"
                                        />
                                        <div>
                                            <h3 className="font-bold text-white flex items-center gap-2">
                                                @{req.profiles?.username}
                                                {req.profiles?.is_agent && <span className="bg-blue-900/50 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-800">AGENT</span>}
                                            </h3>
                                            <p className="text-sm text-gray-400">ID: {req.agent_id}</p>
                                            <div className="mt-2 flex items-center gap-2 text-xs">
                                                <span className="text-gray-500">Status:</span>
                                                {req.status === 'pending' && <span className="text-yellow-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>}
                                                {req.status === 'approved' && <span className="text-primary flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>}
                                                {req.status === 'rejected' && <span className="text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(req.id, req.agent_id, 'approve')}
                                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
                                            >
                                                APPROVE
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, req.agent_id, 'reject')}
                                                className="bg-red-900/50 hover:bg-red-900 border border-red-800 text-red-500 hover:text-red-400 px-4 py-2 rounded text-sm transition-colors"
                                            >
                                                REJECT
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
