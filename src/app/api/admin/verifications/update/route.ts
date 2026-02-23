import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing Supabase credentials in /api/admin/verifications/update");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const body = await req.json();
        const { id, action, agent_id } = body; // action is 'approve' or 'reject'

        if (!id || !action || !agent_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // 1. Update the verification request status
        const { error: updateError } = await supabase
            .from('seller_verifications')
            .update({
                status: newStatus,
                verified_at: action === 'approve' ? new Date().toISOString() : null
            })
            .eq('id', id);

        if (updateError) {
            console.error("Error updating verification status:", updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // 2. If approved, we might also want to flag the profile as a verified seller (optional, but good for UI)
        // For now, we'll rely on the seller_verifications table for authorization, 
        // but let's assume we just return success.

        return NextResponse.json({ success: true, status: newStatus }, { status: 200 });

    } catch (error) {
        console.error("Unexpected error in /api/admin/verifications/update POST:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
