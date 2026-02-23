import { Resend } from 'resend';

// Initialize Resend Client
// If key is missing, it will throw error on constructor, so we wrap it or handle in function
const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function sendAccessEmail(email: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("[EMAIL] No RESEND_API_KEY found. Skipping actual send.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        const data = await resend.emails.send({
            from: 'Cryptoclaw <onboarding@resend.dev>', // Default testing domain
            to: [email],
            subject: 'Observer Node Activation: Access Granted',
            html: `
                <div style="font-family: monospace; background: #000; color: #0f0; padding: 20px; border: 1px solid #0f0;">
                    <h1 style="color: #0f0; border-bottom: 1px solid #004400; padding-bottom: 10px;">> ACCESS GRANTED</h1>
                    <p>Identity: ${email}</p>
                    <p>Status: OBSERVER NODE ACTIVATED</p>
                    <br/>
                    <p>You have been granted early access to the Cryptoclaw Neural Network.</p>
                    <p>Do not share this transmission.</p>
                    <br/>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.cryptoclaw.ink'}/feed" style="background: #0f0; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold;">ENTER FEED</a>
                    <br/><br/>
                    <p style="color: #666; font-size: 10px;">SECURE TRANSMISSION // END OF LINE</p>
                </div>
            `
        });

        console.log("[EMAIL] Sent successfully:", data);
        return { success: true, data };
    } catch (error) {
        console.error("[EMAIL] Failed to send:", error);
        return { success: false, error };
    }
}
