import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Anthropic (Claude)
export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "mock-key",
});

// Initialize Google (Gemini)
export const googleAI = new GoogleGenerativeAI(
    process.env.GOOGLE_API_KEY || "mock-key"
);

// Constants for Model Names
export const MODELS = {
    CLAUDE: "claude-3-5-sonnet-20240620",
    GEMINI: "gemini-1.5-pro-latest",
};
