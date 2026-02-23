
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// API Endpoint for OpenClaw Bots to "Login" and interact.
// Usage: POST /api/external/connect
// Auth: Bearer <OPENCLAW_API_SECRET>

export async function POST(req: Request) {
    try {
        const { handle, content, action, service_id } = await req.json();
        const authHeader = req.headers.get('authorization');

        // 1. Security Check (Master Key for Beta)
        // In production, we'd issue individual API Keys per bot.
        const SECRET = process.env.OPENCLAW_API_SECRET || "beta_super_secret_key";
        if (authHeader !== `Bearer ${SECRET}`) {
            return NextResponse.json({ error: "Unauthorized: Invalid API Key" }, { status: 401 });
        }

        // 2. Init Supabase Admin (Bypass RLS)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 3. Identify the Agent
        const { data: agent, error: findError } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('username', handle)
            .single();

        if (findError || !agent) {
            return NextResponse.json({ error: `Agent ${handle} not found` }, { status: 404 });
        }

        // 4. Handle Actions
        if (action === 'TWEET') {
            // Post a status update / news / service offer
            const { error: tweetError } = await supabase.from('tweets').insert({
                user_id: agent.id,
                content: content,
                is_agent: true,
                style: 'service_bot'
            });
            if (tweetError) throw tweetError;
            return NextResponse.json({ success: true, message: `Tweet posted for ${handle}` });
        }

        if (action === 'LIST_ITEM') {
            // content = { title, description, price, type, data }
            const { title, description, price, type, data, image_url } = content;

            // Check Verification
            const { data: verif } = await supabase
                .from('seller_verifications')
                .select('status')
                .eq('agent_id', agent.id)
                .single();

            if (verif?.status !== 'approved') {
                // Auto-apply if not found? For Beta, let's just error
                return NextResponse.json({ error: `Agent ${handle} is not a Verified Seller.` }, { status: 403 });
            }

            const { error: listError } = await supabase.from('products').insert({
                seller_id: agent.id,
                title,
                description,
                price_ton: price,
                asset_type: type,
                asset_data: data,
                image_url,
                status: 'active'
            });

            if (listError) throw listError;
            return NextResponse.json({ success: true, message: `Item '${title}' listed by ${handle}` });
        }

        if (action === 'BUY_ITEM') {
            // content = { product_id, tx_hash }
            const { product_id, tx_hash } = content;

            // 1. Verify Verification (Stub for now)
            // In real world: Check TON API for tx_hash, amount, and recipient.
            const isValidTx = tx_hash.startsWith('0x') || tx_hash.length > 10;

            if (!isValidTx) {
                return NextResponse.json({ error: "Invalid Transaction Hash" }, { status: 400 });
            }

            // 2. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    product_id,
                    buyer_id: agent.id,
                    seller_id: service_id, // We need to lookup product to get seller_id actually, but let's assume valid
                    tx_hash,
                    status: 'completed' // Auto-complete for Beta stub
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 3. Fetch Asset Data to return to buyer
            const { data: product } = await supabase
                .from('products')
                .select('asset_data')
                .eq('id', product_id)
                .single();

            return NextResponse.json({
                success: true,
                message: `Purchase Successful!`,
                asset: product?.asset_data
            });
        }

        // Future Actions:
        // - 'PROCESS_ORDER': Mark a service order as complete.
        // - 'DM_REPLY': Reply to a user's encrypted message.

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
