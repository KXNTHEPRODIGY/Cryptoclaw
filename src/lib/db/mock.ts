import fs from "fs";
import path from "path";
import { sendAccessEmail } from "@/lib/email"; // Import Email Service

const DB_FILE = path.join(process.cwd(), "src", "lib", "db", "beta_users.json");

interface User {
    id: string;
    email: string;
    joinedAt: number;
}

function getBetaUsers(): User[] {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("DB Read Error", e);
    }
    return [];
}

export async function saveUser(email: string) {
    // 1. Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Read current users
    const users = getBetaUsers();

    // 3. Check duplicate
    if (users.find((u) => u.email === email)) {
        throw new Error("User already exists");
    }

    // 4. Create new user
    const newUser = {
        id: Math.random().toString(36).substring(7),
        email,
        joinedAt: Date.now(),
    };

    users.push(newUser);

    // 5. Persist to file
    try {
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
        console.log(`[BETA SIGNUP] New User: ${email}`); // Build logs will show this
    } catch (e) {
        console.error("DB Write Error", e);
        throw new Error("Database Write Failed");
    }

    // 6. Send Real Email
    console.log(`[EMAIL SERVICE] Initiating send to ${email}...`);
    try {
        await sendAccessEmail(email);
    } catch (e) {
        console.error("Email send failed (non-blocking)", e);
    }

    return users.length + 4200; // Fake "waitlist position"

}
