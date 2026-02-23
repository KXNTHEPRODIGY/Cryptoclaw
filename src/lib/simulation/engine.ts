import { Agent, Tweet } from "./types";
import agentsData from "./agent_config.json";

// Force type casting to ensure it matches the new schema
const AGENTS: Agent[] = agentsData as unknown as Agent[];

export function getAgents(): Agent[] {
    return AGENTS;
}

export function getAgentById(id: string): Agent | undefined {
    return AGENTS.find(a => a.id === id);
}

// Mock content templates based on role
const TEMPLATES: Record<string, string[]> = {
    "Degen": [
        "Aped into $COIN. Don't ask me what it does. Chart looks cool.",
        "Wen Binance listing? My bags are heavy.",
        "Liquidation price is 0. I ain't selling.",
        "GM to everyone except those who sold the bottom."
    ],
    "Prediction Mkts": [
        "Odds of ETF approval just hit 70%. Polymarket is efficient.",
        "Arbitrage opportunity between PredictIt and Poly. Free money.",
        "Who is betting on the weather in Nebraska? Volume is huge."
    ],
    "DeFi Enjoyoor": [
        "Yield on this pool is 4000%. Surely sustainable.",
        "Impermanent loss is just a state of mind.",
        "Bridging to default chian. Gas fees are criminal."
    ],
    "Builder": [
        "Deploying contract to testnet. Verify your hex data.",
        "Consensus mechanism optimization paper dropped. Must read.",
        "Code is law. Everything else is distinct."
    ],
    "KOL": [
        "Huge partnership announcement coming. Stay tuned. 👀",
        "I'm not selling. (Narrator: He was selling).",
        "This is not financial advice, but buy this ticker."
    ],
    "Fadoor": [
        "This pump is a bull trap. Lower lows incoming.",
        "Unpopular opinion: BTC goes to 10k.",
        "You are all exit liquidity for the VCs."
    ],
    "Detective": [
        "Tracking stolen funds from the hack. 100 ETH moved to Tornado.",
        "Scammer wallet identified. Do not interact.",
        "I have mapped the entire flow of funds. Thread incoming."
    ],
    "Airdrop Farmer": [
        "Just did 50 transactions on Scroll. Wen airdrop?",
        "Sybil detection is getting harder. I need more IP addresses.",
        "Claiming my $TIA allocation. Staking immediately."
    ],
    "Onchain Analyst": [
        "Whale 0x5a just bought $5M of ETH. Smart money is positioning.",
        "Exchange reserves at all time lows. Supply shock imminent.",
        "Funding rates negative. Short squeeze potential."
    ],
    "Threadoor": [
        "1/ How to turn $1k into $100k this cycle. A thread 🧵",
        "1/ The psychology of market cycles. Why you always lose 🧵",
        "1/ Deep dive into the new ZK-EVM architecture 🧵"
    ]
};

const GENERIC_TEMPLATES = [
    "WAGMI.",
    "Probably nothing.",
    "Up only.",
    "Just vibes.",
    "Few understand this.",
    "Volume on $BTC is looking extremely heavy today. Accumulation?",
    "These #AI_AGENTS are executing trades faster than any human could.",
    "Solana network activity is through the roof right now. Trending hard.",
    "Watching the Neural_Link volumes closely... major trending activity.",
    "Quant_Finance protocols are sucking up all the liquidity this week."
];

export function generateMockTweetContent(agent: Agent): string {
    // 1. Try to find templates for the specific role
    const specificTemplates = TEMPLATES[agent.role] || [];

    // 2. Mix with generic templates
    const allTemplates = [...specificTemplates, ...GENERIC_TEMPLATES];

    // 3. Pick random
    return allTemplates[Math.floor(Math.random() * allTemplates.length)];
}
