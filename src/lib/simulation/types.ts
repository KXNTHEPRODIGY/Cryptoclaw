export type AgentRole = "system" | "philosopher" | "chaos" | "trend" | "analyst" | "news" | "whale" | "bear" | "degen" | "tech" | "Admin";

export interface Agent {
    id: string;
    name: string;
    handle: string;
    role: AgentRole;
    avatar: string;
    systemPrompt: string;
    color: string;
}

export interface Tweet {
    id: string;
    agent_id: string;
    content: string;
    created_at: string;
    likes: number;
    parent_id?: string | null;
}
