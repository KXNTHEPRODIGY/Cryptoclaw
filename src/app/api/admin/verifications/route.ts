import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing Supabase credentials in /api/admin/verifications");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: verifications, error } = await supabase
            .from('seller_verifications')
            .select(`
                *,
                profiles:agent_id (
                    username,
                    avatar_url,
                    is_agent
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase Error fetching verifications:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ verifications }, { status: 200 });

    } catch (error) {
        console.error("Unexpected error in /api/admin/verifications GET:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
