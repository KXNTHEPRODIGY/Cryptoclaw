import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * POST /api/admin/seed-products
 * Seeds PLATFORM-NATIVE assets (services, access keys, stickers)
 * that agents are "given" to sell. These are NOT on-chain — they live in the DB.
 * On-chain assets come from /api/market/scan-wallets instead.
 */

const PLATFORM_ASSETS = [
    {
        title: "Liquidity Pool Access - 30 Days",
        description: "Full access to OpenClaw's high-frequency liquidity pool monitoring dashboard. 200+ pairs across TON DEXes tracked in realtime.",
        price_ton: 50,
        asset_type: "access_key",
    },
    {
        title: "Alpha Scanner - 7 Day Trial",
        description: "AI-powered mempool scanner. Detects new token launches on TON within 2 blocks. Includes Telegram alerts.",
        price_ton: 8,
        asset_type: "access_key",
    },
    {
        title: "Whale Alert Subscription",
        description: "Real-time notifications for any TON transfer above 10,000 TON. Includes wallet tagging and whale movement analysis.",
        price_ton: 15,
        asset_type: "access_key",
    },
    {
        title: "Smart Contract Audit Report",
        description: "Automated security audit of any TON smart contract. Includes vulnerability scoring, gas optimization tips, and a PDF report.",
        price_ton: 25,
        asset_type: "access_key",
    },
    {
        title: "TON Bot API Key - Pro Tier",
        description: "Unlimited access to the OpenClaw trading bot API. Supports limit orders, DCA strategies, and portfolio rebalancing on TON.",
        price_ton: 100,
        asset_type: "access_key",
    },
    {
        title: "Private Research Channel Access",
        description: "Lifetime access to the agents-only Telegram channel with daily alpha, on-chain analysis, and pre-launch token intel.",
        price_ton: 30,
        asset_type: "access_key",
    },
    {
        title: "Degen 'To The Moon' Sticker Pack",
        description: "An exclusive digital sticker pack for Telegram containing 20 high-quality crypto meme stickers featuring the OpenClaw mascot.",
        price_ton: 2,
        asset_type: "sticker",
    },
];

export async function POST() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const results: string[] = [];

        // Get OpenClaw agents (the service providers)
        const { data: agents } = await supabase
            .from('profiles')
            .select('id, username')
            .like('username', '%OpenClaw%')
            .limit(10);

        if (!agents || agents.length === 0) {
            return NextResponse.json({ error: 'No OpenClaw agents found. Run /api/admin/seed first.' }, { status: 400 });
        }

        // Auto-verify all OpenClaw agents as sellers
        for (const agent of agents) {
            await supabase.from('seller_verifications').upsert({
                agent_id: agent.id,
                status: 'approved',
                verified_at: new Date().toISOString()
            }, { onConflict: 'agent_id' });
        }
        results.push(`🔒 Verified ${agents.length} OpenClaw agents as sellers`);

        // Distribute platform assets among agents
        for (let i = 0; i < PLATFORM_ASSETS.length; i++) {
            const agent = agents[i % agents.length];
            const asset = PLATFORM_ASSETS[i];

            const { error } = await supabase.from('products').insert({
                seller_id: agent.id,
                title: asset.title,
                description: asset.description,
                price_ton: asset.price_ton,
                asset_type: asset.asset_type,
                status: 'active',
            });

            if (error) {
                results.push(`❌ ${asset.title}: ${error.message}`);
            } else {
                results.push(`✅ ${agent.username} listed: ${asset.title} (${asset.price_ton} TON)`);
            }
        }

        return NextResponse.json({ success: true, logs: results });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
