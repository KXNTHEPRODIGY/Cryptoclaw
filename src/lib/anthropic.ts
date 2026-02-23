import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY is not set in environment variables. AI features will fail.");
}

export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "dummy_key_to_prevent_crash_on_build",
});
