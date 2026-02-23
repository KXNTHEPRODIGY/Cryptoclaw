// Custom Regex-based News Fetcher (No External Dependencies)
// This ensures we don't need 'rss-parser' which causes build issues if not installed.

export interface NewsItem {
    headline: string;
    url: string;
    source: string;
    summary: string;
    imageUrl?: string | null;
    publishedAt: number;
}

const SOURCES = [
    { name: "CoinTelegraph", url: "https://cointelegraph.com/rss" },
    { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss" },
    { name: "Decrypt", url: "https://decrypt.co/feed" }
];

export async function fetchLiveNews(): Promise<NewsItem[]> {
    const news: NewsItem[] = [];

    try {
        // We will execute these in parallel
        const promises = SOURCES.map(async (source) => {
            try {
                const res = await fetch(source.url, { next: { revalidate: 300 } });
                const xml = await res.text();

                // Simple Regex Parser for RSS (Robust enough for standard feeds)
                const items = xml.match(/<item>[\s\S]*?<\/item>/g)?.slice(0, 5) || [];

                return items.map(item => {
                    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
                    const linkMatch = item.match(/<link>(.*?)<\/link>/);
                    const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);

                    // Image Extraction Logic
                    const mediaMatch = item.match(/<media:content[^>]*url="(.*?)"/) || item.match(/<enclosure[^>]*url="(.*?)"/);
                    let imageUrl = mediaMatch ? mediaMatch[1] : null;

                    // Fallback: Try to find an img tag in the description
                    if (!imageUrl && descMatch) {
                        const imgTagMatch = descMatch[1].match(/<img[^>]+src="(.*?)"/);
                        if (imgTagMatch) {
                            imageUrl = imgTagMatch[1];
                        }
                    }

                    return {
                        headline: titleMatch ? decodeHTMLEntities(titleMatch[1]) : "Unknown Title",
                        url: linkMatch ? linkMatch[1] : "#",
                        source: source.name,
                        summary: descMatch ? decodeHTMLEntities(descMatch[1].replace(/<[^>]*>?/gm, "")).substring(0, 150) + "..." : "No summary.",
                        imageUrl: imageUrl,
                        publishedAt: Date.now() // RSS dates are annoying to parse with regex, simpler to just timestamp 'now' for the feed
                    };
                });
            } catch (e) {
                console.error(`Failed to fetch ${source.name}`, e);
                return [];
            }
        });

        const results = await Promise.all(promises);
        results.flat().forEach(item => news.push(item));

    } catch (e) {
        console.error("Global News Fetch Error", e);
    }

    return news.sort(() => Math.random() - 0.5).slice(0, 15); // Return 15 random fresh stories
}

function decodeHTMLEntities(text: string) {
    if (!text) return "";
    return text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}
