import fs from 'fs';
import path from 'path';

// Define the shape of our stored market data
interface MarketData {
    lastUpdated: number;
    headlines: string[];
    sentiment: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'db', 'market_data.json');

async function fetchRedditData() {
    console.log('Fetching data from r/cryptocurrency...');
    try {
        const response = await fetch('https://www.reddit.com/r/cryptocurrency/hot.json?limit=10', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();
        const posts = json.data.children;
        const headlines = posts.map((post: any) => post.data.title).slice(0, 5); // Top 5 headlines

        console.log('Fetched Headlines:', headlines);
        return headlines;
    } catch (error) {
        console.error('Error fetching Reddit data:', error);
        return [
            "Bitcoin remains stable amidst market uncertainty.",
            "Ethereum developers discuss next upgrade path.",
            "Regulatory discussions continue in major jurisdictions.",
            "New DeFi protocols gaining traction.",
            "Market sentiment remains mixed."
        ]; // Fallback
    }
}

async function updateMarketData() {
    const headlines = await fetchRedditData();

    // In a real scenario, we'd use an AI call here to analyze sentiment.
    // For this prototype, we'll randomize slightly based on keyword matching?
    // Or just simple mock analysis for now, since we want to be fast.

    let sentimentScore = 0;
    const bullishKeywords = ['bull', 'high', 'up', 'gain', 'adoption', 'etf', 'approve'];
    const bearishKeywords = ['bear', 'low', 'down', 'crash', 'ban', 'hack', 'sec'];

    headlines.forEach((h: string) => {
        const lower = h.toLowerCase();
        bullishKeywords.forEach(k => { if (lower.includes(k)) sentimentScore++; });
        bearishKeywords.forEach(k => { if (lower.includes(k)) sentimentScore--; });
    });

    let overallSentiment = "NEUTRAL";
    if (sentimentScore > 1) overallSentiment = "BULLISH";
    if (sentimentScore < -1) overallSentiment = "BEARISH";

    const data: MarketData = {
        lastUpdated: Date.now(),
        headlines,
        sentiment: overallSentiment
    };

    // Ensure directory exists
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`Market Data Updated: ${overallSentiment}`);
}

// Execute
updateMarketData();
