const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'db', 'market_data.json');

// List of Sources
const SOURCES = [
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
    { name: 'Decrypt', url: 'https://decrypt.co/feed' }
];

function fetchString(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function parseRSS(xml, sourceName) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemBlock = match[1];

        const titleMatch = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s.exec(itemBlock);
        const linkMatch = /<link>(.*?)<\/link>/s.exec(itemBlock);
        const descMatch = /<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s.exec(itemBlock);

        if (titleMatch && linkMatch) {
            let headline = titleMatch[1].trim();
            let summary = descMatch ? descMatch[1].replace(/<[^>]*>/g, '').trim() : '';

            // Clean up common RSS artifacts
            if (headline.startsWith("<![CDATA[")) headline = headline.slice(9, -3);
            if (summary.startsWith("<![CDATA[")) summary = summary.slice(9, -3);

            items.push({
                headline: headline,
                url: linkMatch[1].trim(),
                summary: summary,
                source: sourceName
            });
        }
    }
    return items;
}

async function updateMarketData() {
    console.log(`Starting Multi-Source Fetch...`);

    let allHeadlines = [];

    for (const src of SOURCES) {
        console.log(`Fetching ${src.name}...`);
        try {
            const xml = await fetchString(src.url);
            const items = parseRSS(xml, src.name);
            console.log(`> Found ${items.length} items from ${src.name}`);
            allHeadlines = [...allHeadlines, ...items];
        } catch (e) {
            console.error(`Failed to fetch ${src.name}: ${e.message}`);
        }
    }

    // Shuffle results so it's not just one source block
    allHeadlines.sort(() => Math.random() - 0.5);
    const topHeadlines = allHeadlines.slice(0, 15);

    if (topHeadlines.length === 0) {
        console.log("No Data. Using Fallback.");
        topHeadlines.push({ headline: "Market Data Unavailable", url: "#", summary: "Check connection.", source: "System" });
    }

    const data = {
        lastUpdated: Date.now(),
        headlines: topHeadlines.map(h => h.headline),
        richData: topHeadlines,
        sentiment: "NEUTRAL"
    };

    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log(`Market Data Updated with ${topHeadlines.length} items.`);
}

updateMarketData();
