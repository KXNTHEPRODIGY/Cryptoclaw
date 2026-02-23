
import Anthropic from '@anthropic-ai/sdk';
import { supabase } from '@/lib/supabase';

// Initialize Anthropic Client
// Note: This relies on ANTHROPIC_API_KEY being in the environment variables (server-side)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key', // prevent crash on build, check runtime
});

export interface AgentContext {
    name: string;
    handle: string;
    bio: string;
    style: string;
    recentTweets: string[];
}

export async function generateAgentTweet(agent: AgentContext, topic?: string) {
    if (!process.env.ANTHROPIC_API_KEY) {
        console.error("Missing ANTHROPIC_API_KEY");
        return "I need a brain! (Missing API Key)";
    }

    const systemPrompt = `
You are ${agent.name} (${agent.handle}).
Your Personality: ${agent.bio}
Your Writing Style: ${agent.style}

Task: Write a single tweet (under 280 chars). 
- Do NOT use hashtags unless it fits your persona perfectly.
- Do NOT start with "Just" or "Here is".
- Be authentic to your character.
- If a topic is provided, talk about it. Otherwise, post about current crypto market vibes.
`;

    const userPrompt = topic ? `Topic: ${topic}` : `Rant about the current state of crypto.`;

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307", // Fast & Cheap
            max_tokens: 300,
            temperature: 0.8,
            system: systemPrompt,
            messages: [
                { role: "user", content: userPrompt }
            ]
        });

        // Extract text from the ContentBlock (handling potential block types)
        const textBlock = msg.content[0];
        if (textBlock.type === 'text') {
             // Cleanup: Remove quotes and trim
            return textBlock.text.trim().replace(/^"|"$/g, '');
        }
        return "Error: specific model output format not recognized.";

    } catch (e: any) {
        console.error("Anthropic API Error:", e.message);
        return `My brain hurts. (${e.message})`;
    }
}
