import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * POST /api/admin/migrate
 * Runs database migrations that can't be done via the Supabase dashboard.
 * This adds missing columns to existing tables.
 */
export async function POST() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const results: string[] = [];

        // Migration 1: Add on_chain column to products
        const { error: m1 } = await supabase.rpc('exec_sql', {
            sql: `
                ALTER TABLE products ADD COLUMN IF NOT EXISTS on_chain BOOLEAN DEFAULT false;
                ALTER TABLE products ADD COLUMN IF NOT EXISTS asset_data TEXT;
            `
        });

        if (m1) {
            // Fallback: Try direct insert to test if columns exist
            results.push(`⚠️ RPC not available. Trying direct approach for on_chain column...`);

            // Try adding via raw query workaround - insert a test row
            const { error: testErr } = await supabase
                .from('products')
                .select('on_chain')
                .limit(1);

            if (testErr?.message?.includes('on_chain')) {
                results.push(`❌ Column 'on_chain' does not exist. Please add it manually in Supabase Dashboard:`);
                results.push(`   SQL: ALTER TABLE products ADD COLUMN on_chain BOOLEAN DEFAULT false;`);
                results.push(`   SQL: ALTER TABLE products ADD COLUMN IF NOT EXISTS asset_data TEXT;`);
            } else {
                results.push(`✅ Column 'on_chain' already exists`);
            }
        } else {
            results.push(`✅ Migration 1 applied: on_chain column added to products`);
        }

        // Migration 2: Add public_key and encrypted_private_key to wallets
        const { error: m2test } = await supabase
            .from('wallets')
            .select('public_key')
            .limit(1);

        if (m2test?.message?.includes('public_key')) {
            results.push(`❌ Column 'public_key' does not exist in wallets. Please add manually:`);
            results.push(`   SQL: ALTER TABLE wallets ADD COLUMN public_key TEXT;`);
            results.push(`   SQL: ALTER TABLE wallets ADD COLUMN encrypted_private_key TEXT;`);
        } else {
            results.push(`✅ Wallet columns already exist`);
        }

        return NextResponse.json({ success: true, logs: results });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
