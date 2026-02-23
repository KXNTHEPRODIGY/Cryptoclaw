'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Lock, Copy, ExternalLink, CheckCircle } from 'lucide-react';

interface Product {
    id: string;
    title: string;
    description: string;
    price_ton: number;
    asset_type: string;
    asset_data?: string;
    image_url?: string;
    status: string;
    profiles?: {
        username: string;
        avatar_url?: string;
        is_agent: boolean;
    };
}

const TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    sticker: { label: 'STICKER PACK', icon: <span>🎨</span>, color: 'text-pink-400' },
    gift: { label: 'TG GIFT', icon: <span>🎁</span>, color: 'text-yellow-400' },
    nft: { label: 'NFT', icon: <span>💎</span>, color: 'text-purple-400' },
    access_key: { label: 'ACCESS KEY', icon: <Lock size={14} />, color: 'text-cyan-400' },
};

export default function ProductModal({
    product,
    onClose,
}: {
    product: Product;
    onClose: () => void;
}) {
    const [step, setStep] = useState<'details' | 'pay' | 'success'>('details');
    const [txHash, setTxHash] = useState('');
    const [verifying, setVerifying] = useState(false);

    const typeInfo = TYPE_LABELS[product.asset_type] || TYPE_LABELS.access_key;
    const sellerWallet = 'EQD...seller_address'; // In production, fetch from DB

    const handleBuy = async () => {
        if (!txHash || txHash.length < 10) return;
        setVerifying(true);

        try {
            const res = await fetch('/api/market/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: product.id,
                    buyer_id: 'sample_buyer_id', // In production, get from authenticated session
                    tx_hash: txHash
                })
            });

            if (res.ok) {
                const data = await res.json();
                setStep('success');
                // You might optionally store the data.asset_data or update the product state,
                // but the current UI just shows it from the existing product.asset_data if available.
                // We'll trust the payload returned from the api here if we wanted to dynamically assign it.
            } else {
                const errorData = await res.json();
                alert(`Purchase failed: ${errorData.error || 'Server error'}`);
            }
        } catch (error) {
            console.error('Purchase error:', error);
            alert('An unexpected error occurred during purchase.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-card/90 backdrop-blur-xl border border-border pb-6 shadow-[0_0_50px_rgba(0,152,234,0.15)] rounded-2xl overflow-hidden">
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                {step === 'details' && (
                    <>
                        {/* Header Visual */}
                        <div className="h-40 bg-gradient-to-br from-primary/20 to-card flex items-center justify-center border-b border-border/50">
                            <div className="text-center">
                                <div className="text-6xl mb-3 drop-shadow-lg">{typeInfo.icon}</div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${typeInfo.color}`}>{typeInfo.label}</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-white mb-2">{product.title}</h2>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">{product.description}</p>

                            {/* Seller */}
                            <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-muted/30 border border-border/50">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 p-1.5 shrink-0">
                                    <img src="/logo.svg" alt="Agent Logo" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-foreground">{product.profiles?.username || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">Verified Creator</p>
                                </div>
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>

                            {/* Price + Buy */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
                                    <p className="text-3xl font-black text-primary drop-shadow-sm flex items-center gap-2">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" /><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        {product.price_ton}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setStep('pay')}
                                    className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold uppercase text-sm shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                                >
                                    Proceed to Pay
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {step === 'pay' && (
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Complete Purchase</h2>

                        {/* Step 1: Send TON */}
                        <div className="mb-6 p-5 rounded-xl bg-card border border-border/50">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Step 1: Send TON</p>
                            <p className="text-sm text-foreground mb-4">
                                Send exactly <span className="text-primary font-bold">{product.price_ton} TON</span> to:
                            </p>
                            <div className="flex items-center gap-3 bg-background p-3 rounded-lg border border-border break-all">
                                <span className="flex-1 font-sans text-sm text-foreground/80">{sellerWallet}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(sellerWallet)}
                                    className="p-2 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Paste TX Hash */}
                        <div className="mb-8">
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Step 2: Paste Transaction Hash</p>
                            <input
                                type="text"
                                placeholder="0x... or base64 hash"
                                value={txHash}
                                onChange={(e) => setTxHash(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep('details')} className="flex-1 py-3 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors">
                                Back
                            </button>
                            <button
                                onClick={handleBuy}
                                disabled={verifying || txHash.length < 10}
                                className="flex-1 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm uppercase transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                            >
                                {verifying ? 'Verifying...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-8 text-center py-16">
                        <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,152,234,0.5)]" />
                        <h2 className="text-2xl font-black text-foreground mb-3">Purchase Complete!</h2>
                        <p className="text-muted-foreground mb-8">Your asset has been securely delivered to your wallet.</p>

                        <div className="bg-background border border-primary/30 rounded-xl p-5 shadow-inner break-all mb-8">
                            <span className="font-sans text-sm text-primary">{product.asset_data || 'Asset data unavailable'}</span>
                        </div>

                        <button onClick={onClose} className="px-10 py-3 rounded-full border border-border hover:bg-muted text-foreground font-semibold text-sm transition-colors">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
