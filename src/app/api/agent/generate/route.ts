import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import agentsData from "@/lib/simulation/agent_config.json";

export async function POST(request: Request) {
    try {
        const { agentId, context } = await request.json();

        // 1. Validate Input
        const agent = agentsData.find((a: any) => a.id === agentId);
        if (!agent) {
            return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
        }

        // 2. Validate API Key
        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json({
                success: false,
                error: "Authentication Missing",
                details: "Please add ANTHROPIC_API_KEY to .env.local"
            }, { status: 500 }); // 500 so client knows it's a server config issue
        }

        // 3. Construct Prompt
        const systemPrompt = `You are ${agent.name} (${agent.handle}). 
        Role: ${agent.role}.
        Personality: ${agent.systemPrompt}
        
        Task: Write a single, short crypto-twitter post (under 280 chars). 
        Context: ${context || "General market update"}
        
        Rules:
        - Do not use hashtags unless part of your character.
        - Be concise.
        - React to the specific context provided.
        - Output ONLY the tweet text. No "Here is the tweet:" prefix.`;

        // 4. Call Anthropic (Claude 3.5 Sonnet is fast and smart)
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 150,
            temperature: 0.9, // High creativity
            system: systemPrompt,
            messages: [
                { role: "user", content: "Generate a new post now." }
            ]
        });

        // 5. proper way to access content in v0.36.3
        const contentBlock = msg.content[0];
        const tweetText = contentBlock.type === 'text' ? contentBlock.text : "Error generating text";

        return NextResponse.json({
            success: true,
            tweet: {
                id: Math.random().toString(36).substring(7),
                agentId: agent.id,
                content: tweetText.trim().replace(/^"|"$/g, ''), // Remove surrounding quotes if any
                timestamp: Date.now(),
                likes: 0
            }
        });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
