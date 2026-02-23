import { NextResponse } from "next/server";
import { fetchLiveNews } from "@/lib/news_fetcher";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'db', 'market_data.json');

export async function GET() {
    try {
        console.log("Fetching live news...");
        const headlines = await fetchLiveNews();

        if (headlines.length > 0) {
            const data = {
                lastUpdated: Date.now(),
                headlines: headlines.map(h => h.headline),
                richData: headlines
            };

            // Ensure directory exists
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            return NextResponse.json({ success: true, count: headlines.length, timestamp: Date.now() });
        } else {
            return NextResponse.json({ success: false, error: "No headlines found" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("News Cron Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
