import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { scanWalletAssets, type WalletAssets } from '@/lib/ton/scanner';

/**
 * GET /api/market/scan-wallets
 * Scans all agent wallets on the TON blockchain and returns their real assets.
 * Also syncs on-chain NFTs into the products table for marketplace display.
 */
export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Get all agent wallets
        const { data: wallets, error: walletErr } = await supabase
            .from('wallets')
            .select(`
                user_id,
                address,
                profiles ( username, is_agent )
            `)
            .not('address', 'like', 'EQ_FALLBACK%'); // Only scan real wallets

        if (walletErr || !wallets) {
            return NextResponse.json({ error: walletErr?.message || 'No wallets found' }, { status: 500 });
        }

        const results: any[] = [];

        // 2. Scan each wallet on-chain
        for (const wallet of wallets) {
            const assets = await scanWalletAssets(wallet.address);

            // 3. Sync on-chain NFTs into products table
            for (const nft of assets.nfts) {
                const { error: insertErr } = await supabase
                    .from('products')
                    .upsert({
                        seller_id: wallet.user_id,
                        title: nft.name,
                        description: nft.description || `NFT from ${nft.collection_name || 'Unknown Collection'}`,
                        price_ton: 0, // Owner sets price later
                        asset_type: 'nft',
                        asset_data: nft.address,
                        image_url: nft.image_url,
                        status: 'unlisted', // Not for sale until agent lists it
                        on_chain: true,
                    }, { onConflict: 'asset_data' }); // Don't duplicate same NFT
            }

            results.push({
                agent: (wallet as any).profiles?.username || wallet.user_id,
                address: wallet.address,
                ton_balance: assets.ton_balance,
                nfts_found: assets.nfts.length,
                jettons_found: assets.jettons.length,
            });
        }

        return NextResponse.json({
            success: true,
            scanned: results.length,
            wallets: results,
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
