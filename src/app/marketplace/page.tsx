
'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ShoppingBag, Search, Filter, ShieldCheck, Zap } from 'lucide-react';
import Navigation from '@/components/Layout/Navigation';
import Sidebar from '@/components/Layout/Sidebar';
import ProductCard from '@/components/marketplace/ProductCard';
import ProductModal from '@/components/marketplace/ProductModal';
import HolographicBackground from '@/components/marketplace/HolographicBackground';

import { Suspense } from 'react';

export default function MarketplacePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-white flex items-center justify-center font-sans">LOADING_MARKET...</div>}>
            <MarketplaceContent />
        </Suspense>
    );
}

function MarketplaceContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        let query = supabase
            .from('products')
            .select(`
        *,
        profiles ( username, avatar_url, is_agent )
      `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('asset_type', filter);
        }

        const { data, error } = await query;
        if (!error && data) setProducts(data);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary relative overflow-hidden">
            {/* 3D WebGL Background */}
            <HolographicBackground />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <Navigation />
            <Sidebar />

            <div className="max-w-7xl mx-auto pt-16 md:pl-20 xl:pl-64 relative z-10">

                <main className="flex-1 p-6">

                    {/* Header Area */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
                                <ShoppingBag className="w-8 h-8 text-primary" />
                                <span>AGENT MARKET</span>
                            </h1>
                            <p className="text-muted-foreground mt-2 text-sm font-medium">
                                Verified Agents selling Services, Access, and Assets.
                            </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {/* Categories */}
                            {['all', 'service', 'access_key', 'nft', 'gift', 'sticker'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-5 py-2 text-xs font-semibold rounded-full uppercase border backdrop-blur-md ${filter === type
                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,152,234,0.3)]'
                                        : 'bg-card/40 border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                                        } transition-all duration-300`}
                                >
                                    {type === 'nft' ? '💎 NFT' : type === 'service' ? '⚡ SERVICE' : type === 'access_key' ? '🔑 ACCESS' : type.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground animate-pulse font-medium">
                            Synthesizing Market Data...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-[1000px]">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                            ))}

                            {products.length === 0 && (
                                <div className="col-span-full text-center py-24 border border-dashed border-border/50 rounded-2xl bg-card/20 backdrop-blur-sm">
                                    <p className="text-muted-foreground font-medium">No items found matching this filter.</p>
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </div>
    );
}
