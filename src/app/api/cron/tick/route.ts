import { NextResponse } from "next/server";
import { getAgents, generateMockTweetContent } from "@/lib/simulation/engine";
import { Tweet, Agent } from "@/lib/simulation/types";
import { supabase } from "@/lib/supabase";
import { anthropic } from "@/lib/anthropic";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic'; // Ensure not cached

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'db', 'market_data.json');

function getMarketContext() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            if (data.headlines && data.headlines.length > 0) {
                // Pick a random headline
                return data.headlines[Math.floor(Math.random() * Math.min(5, data.headlines.length))];
            }
        }
    } catch (e) { console.error(e); }
    return "Market is sideways.";
}

// Real AI Generation
async function generateRealTweet(agent: Agent, context: string, topic?: string): Promise<string> {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("No API Key");

    // Randomize Length
    const lengths = [
        "very short (under 50 chars)",
        "short (under 140 chars)",
        "standard (under 280 chars)",
        "long (detailed analysis, 280-400 chars)",
        "thread-style (broken into points, deep dive)"
    ];
    // Weighted random: favour standard/long slightly more now
    const weightedIndex = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * lengths.length);
    const lengthInstruction = lengths[weightedIndex];

    // Randomize Sub-Topic / Vibe
    let vibe = "";
    if (topic) {
        vibe = `focusing specifically on ${topic} related content`;
    } else {
        const vibes = [
            "analyzing the chart",
            "reacting to recent news",
            "shilling a bag",
            "fuding a competitor",
            "general market sentiment",
            "philosophical crypto musing",
            "asking a question to followers",
            "detailed technical analysis",
            "macro-economic rant"
        ];
        vibe = vibes[Math.floor(Math.random() * vibes.length)];
    }

    const systemPrompt = `You are ${agent.name} (${agent.handle}).
Role: ${agent.role}.
Personality: ${agent.systemPrompt}

Task: Write a single, engaging crypto-twitter post.
Length: ${lengthInstruction}
Context: "${context}"
Current Vibe/Action: ${vibe}

Rules:
- Speak EXACTLY like your personality (slang, tone, formatting).
- **ABSOLUTELY NO EMOJIS**. The user hates them. Use text-based emotion if needed, or dry wit.
- Do not use hashtags unless it fits your character.
- If the length is 'long' or 'thread-style', feel free to use newlines and bullet points.
- Output ONLY the tweet text.`;

    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 400, // Increased for longer content
        temperature: 0.9,
        system: systemPrompt,
        messages: [
            { role: "user", content: "Post something now." }
        ]
    });

    const contentBlock = msg.content[0];
    return contentBlock.type === 'text' ? contentBlock.text : "Error generating text";
}

export async function GET(request: Request) {
    try {
        const agents = getAgents();
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const marketContext = getMarketContext();

        // Get topic from URL
        const url = new URL(request.url);
        const topic = url.searchParams.get('topic') || undefined;

        let content = "";
        let isRealAI = false;
        let parentId: string | null = null;

        // 10% chance to reply to an existing tweet if Real AI is enabled
        if (process.env.ANTHROPIC_API_KEY && Math.random() < 0.1) {
            const { data: recentTweets } = await supabase
                .from('tweets')
                .select('*')
                .is('parent_id', null)
                .order('created_at', { ascending: false })
                .limit(20);

            if (recentTweets && recentTweets.length > 0) {
                const randomParent = recentTweets[Math.floor(Math.random() * recentTweets.length)];
                parentId = randomParent.id;
                const parentContext = `You are replying to a tweet that says: "${randomParent.content}".`;
                const fullContext = `${marketContext}\n\n${parentContext}\nMake sure your tweet feels like a direct reply or quote-tweet to this statement.`;

                try {
                    content = await generateRealTweet(agent, fullContext, topic);
                    isRealAI = true;
                } catch (e) {
                    // Fallback to non-reply mock if API fails
                    content = generateMockTweetContent(agent);
                    parentId = null;
                }
            }
        }

        if (!isRealAI) {
            // Try Real AI (for new top-level tweet)
            if (process.env.ANTHROPIC_API_KEY) {
                try {
                    content = await generateRealTweet(agent, marketContext, topic);
                    isRealAI = true;
                } catch (e) {
                    console.error("Anthropic failed, falling back to mock:", e);
                    content = generateMockTweetContent(agent);
                }
            } else {
                console.log("No API Key, using mock.");
                content = generateMockTweetContent(agent);
            }
        }

        const cleanedContent = content.trim().replace(/^"|"$/g, '');

        const { data: insertedTweet, error } = await supabase
            .from('tweets')
            .insert({
                agent_id: agent.id,
                content: cleanedContent,
                likes: Math.floor(Math.random() * (isRealAI ? 500 : 50)),
                parent_id: parentId
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, tweet: insertedTweet, method: isRealAI ? "AI" : "Mock" });
    } catch (error: any) {
        console.error("Cron Error: ", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
