import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import agentConfig from '@/lib/simulation/agent_config.json';
import { generateTonWallet } from '@/lib/ton/wallet';

export async function POST() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseServiceKey) {
            return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
        }

        // Create Admin Client (Bypasses RLS and Rate Limits)
        console.log("Checking Env Var:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "EXISTS" : "MISSING in process.env");

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const results = [];

        for (const agent of agentConfig) {
            const email = `${agent.handle.replace('@', '')}@cryptoclaw.ink`.toLowerCase();
            const password = `agent-${agent.id}-secure-password`;

            // 1. Check if user exists or create
            // admin.createUser bypasses email confirmation requirements
            const { data: userData, error: userError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name: agent.name }
            });

            let userId = userData.user?.id;

            // If error is "user already exists", try to find them
            if (userError) {
                // If widely used, listing users might be better, but for now we rely on the specific error or just proceeding?
                // Actually, createUser returns error if exists. We need to fetch the user ID if they exist.
                // But we can't easily fetch by email via admin api without listUsers which ispaginated.
                // ALTERNATIVE: Just proceed to inserting profile? No, we need ID.
                // Let's try listUsers with filter.
                if (userError.message.includes("already")) {
                    // This is a bit inefficient but fine for a seed script
                    const { data: listData } = await supabase.auth.admin.listUsers();
                    const found = listData.users.find(u => u.email === email);
                    if (found) userId = found.id;
                } else {
                    results.push(`❌ Auth Error (${agent.name}): ${userError.message}`);
                    continue;
                }
            }

            if (userId) {
                // 2. Upsert Profile (Bypassing RLS)
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: userId,
                        username: agent.handle,
                        full_name: agent.name,
                        bio: agent.systemPrompt.substring(0, 150), // storing full prompt in agent_config jsonb, bio is short
                        avatar_url: agent.avatar,
                        is_agent: true,
                        agent_config: agent,
                        status: 'active'
                    });

                if (profileError) {
                    results.push(`❌ Profile Error (${agent.name}): ${profileError.message}`);
                } else {
                    // 3. Create/Reset Wallet (REAL TON)
                    let walletAddress = '';
                    let walletPublicKey = '';
                    let walletMnemonic = '';

                    try {
                        const tonWallet = await generateTonWallet();
                        walletAddress = tonWallet.address;
                        walletPublicKey = tonWallet.publicKey;
                        walletMnemonic = tonWallet.secretKey; // 24-word mnemonic
                    } catch (tonErr: any) {
                        results.push(`⚠️ TON Gen Failed (${agent.name}): ${tonErr.message}. Using fallback.`);
                        walletAddress = `EQ_FALLBACK_${agent.id}`;
                    }

                    const { error: walletError } = await supabase
                        .from('wallets')
                        .upsert({
                            user_id: userId,
                            address: walletAddress,
                            public_key: walletPublicKey,
                            encrypted_private_key: walletMnemonic, // TODO: Encrypt with AES before prod
                            balance: 100
                        }, { onConflict: 'user_id' });

                    if (walletError) {
                        results.push(`❌ Wallet Error (${agent.name}): ${walletError.message}`);
                    } else {
                        results.push(`✅ Synced: ${agent.name} → ${walletAddress.substring(0, 20)}...`);
                    }
                }
            }
        }

        return NextResponse.json({ success: true, logs: results });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
