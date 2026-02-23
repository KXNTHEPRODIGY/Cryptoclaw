'use client';

import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Generates a consistent "Image" gradient/pattern locally based on the string
const getPattern = (str: string) => {
    const colors = [
        'from-primary/40 to-background',
        'from-accent/40 to-background',
        'from-blue-600/40 to-background',
        'from-cyan-600/40 to-background',
        'from-teal-600/40 to-background'
    ];
    const index = str.length % colors.length;
    return colors[index];
};

export default function ProductCard({ product, onClick }: { product: any; onClick?: () => void }) {
    const isService = product.asset_type === 'service';
    const isAccess = product.asset_type === 'access_key';

    // 3D Tilt Effect Setup
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            // Framer motion perspective container
            className="perspective-[1000px] h-full"
        >
            <div
                style={{ transform: "translateZ(30px)" }}
                className="group border border-border/40 bg-card/60 backdrop-blur-xl hover:border-primary/60 hover:shadow-[0_0_30px_rgba(0,152,234,0.15)] transition-all duration-300 flex flex-col h-full rounded-2xl overflow-hidden relative cursor-pointer"
            >
                {/* 1. VISUAL HEADER */}
                <div className={`h-48 w-full relative overflow-hidden bg-gradient-to-br ${getPattern(product.title)} flex items-center justify-center p-6 text-center`}>
                    {product.image_url ? (
                        <motion.img
                            style={{ transform: "translateZ(40px)" }}
                            src={product.image_url}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                            {/* Dynamic Typography for Services */}
                            <div className="text-4xl font-black text-white/5 absolute inset-0 flex items-center justify-center -rotate-12 scale-150 pointer-events-none select-none">
                                {product.asset_type}
                            </div>
                            <motion.div
                                style={{ transform: "translateZ(50px)" }}
                                className="relative z-20 border border-white/10 p-4 rounded-xl backdrop-blur-md bg-background/20 w-full max-w-[80%]"
                            >
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight break-words">
                                    {product.title}
                                </h3>
                            </motion.div>
                            <motion.div
                                style={{ transform: "translateZ(30px)" }}
                                className="flex items-center justify-center gap-2 mt-3 text-xs font-medium text-accent relative z-20 bg-background/30 px-3 py-1 rounded-full drop-shadow-md"
                            >
                                {isService && <Zap size={14} />}
                                {isAccess && <Lock size={14} />}
                                <span>{product.asset_type.toUpperCase()}</span>
                            </motion.div>
                        </div>
                    )}

                    {/* Price Tag Overlay */}
                    <motion.div
                        style={{ transform: "translateZ(60px)" }}
                        className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md rounded-full px-3 py-1 text-sm font-bold text-white shadow-lg z-30 flex items-center gap-1"
                    >
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" /><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {product.price_ton}
                    </motion.div>
                </div>

                {/* 2. DETAILS (Bottom Info) */}
                <div className="p-5 flex-1 flex flex-col bg-card/40 backdrop-blur-md z-10">
                    {/* Seller Info */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 p-1 shrink-0">
                            <img src="/logo.svg" alt="Agent Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-medium text-foreground truncate flex-1">{product.profiles?.username || 'Unknown Agent'}</span>
                        {/* Verified Badge */}
                        <ShieldCheck className="w-4 h-4 text-primary" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-5 line-clamp-3 flex-1 break-words">
                        {product.description || "No description provided."}
                    </p>

                    <button className="w-full py-2.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
