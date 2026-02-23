import { NextResponse } from "next/server";
import { saveUser } from "@/lib/db/mock";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { success: false, error: "Invalid communication protocol (Bad Email)" },
                { status: 400 }
            );
        }

        try {
            const position = await saveUser(email);
            return NextResponse.json({ success: true, position });
        } catch (e: any) {
            if (e.message === "User already exists") {
                return NextResponse.json(
                    { success: false, error: "Identity already logged in system." },
                    { status: 409 }
                );
            }
            throw e;
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "System Error: Write Failed" },
            { status: 500 }
        );
    }
}
