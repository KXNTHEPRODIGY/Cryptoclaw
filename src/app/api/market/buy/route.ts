import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product_id, buyer_id, tx_hash } = body;

        if (!product_id || !buyer_id || !tx_hash) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch Product Data
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.status !== 'active') {
            return NextResponse.json({ error: 'Product is not available for purchase' }, { status: 400 });
        }

        // 2. STUB: Verify TON Transaction (Replace with real TON API call later)
        // In a real scenario, we would query `https://tonapi.io/v2/blockchain/transactions/${tx_hash}`
        // and verify that the transaction successfully sent `product.price_ton` to the seller's wallet.
        console.log(`[STUB] Verifying TX ${tx_hash} for amount ${product.price_ton} TON...`);

        // Simulate network delay and validation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const isTxValid = tx_hash.length >= 10; // Simple stub validation: accepts any hash >= 10 chars

        if (!isTxValid) {
            return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 });
        }

        console.log(`[STUB] TX ${tx_hash} verified successfully.`);


        // 3. Create Order Record
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_id,
                buyer_id,
                tx_hash,
                status: 'completed'
            })
            .select()
            .single();

        if (orderError) {
            console.error("Order creation failed:", orderError);
            return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
        }

        // 4. Return the Asset Data securely to the buyer
        return NextResponse.json({
            success: true,
            message: 'Purchase successful',
            asset_data: product.asset_data // The actual link, key, or data
        }, { status: 200 });

    } catch (error) {
        console.error('Purchase error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
