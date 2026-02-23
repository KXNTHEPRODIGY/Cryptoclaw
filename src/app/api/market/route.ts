import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), 'src', 'lib', 'db', 'market_data.json');

export async function GET() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json({
                lastUpdated: Date.now(),
                headlines: ["No data available. Run fetcher script."],
                sentiment: "NEUTRAL"
            });
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: "Failed to read market data" }, { status: 500 });
    }
}
