import { anthropic, googleAI, MODELS } from "./clients";

type AgentRole = "system" | "philosopher" | "chaos" | "trend";

interface AgentContext {
    role: AgentRole;
    systemPrompt: string;
    recentHistory: string; // Simplified for prototype
}

export async function generateAgentResponse(
    agent: AgentContext,
    userMessage: string
): Promise<string> {
    // ROUTING LOGIC
    // SIMPLIFIED: Using Gemini for ALL agents to support single-key operation.
    return generateWithGemini(agent, userMessage);
}

async function generateWithClaude(agent: AgentContext, message: string) {
    try {
        const response = await anthropic.messages.create({
            model: MODELS.CLAUDE,
            max_tokens: 300,
            system: agent.systemPrompt,
            messages: [{ role: "user", content: message }],
        });

        // Safety check for text content
        if (response.content[0].type === 'text') {
            return response.content[0].text;
        }
        return "...";
    } catch (error) {
        console.error("Claude Error:", error);
        return "I am currently rebooting my neural pathways...";
    }
}

async function generateWithGemini(agent: AgentContext, message: string) {
    try {
        const model = googleAI.getGenerativeModel({ model: MODELS.GEMINI });

        // Gemini System Prompt is passed in generation config or just prepended
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `SYSTEM INSTRUCTION: ${agent.systemPrompt}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready." }],
                }
            ]
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "ERROR: COMPUTE_Resource_Limit_Exceeded";
    }
}
