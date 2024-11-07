import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/client";

const supabase = createClient();

export async function POST(req: NextRequest) {
    try {
        const { publicUrl } = await req.json(); 

        if (!publicUrl) {
            return NextResponse.json({ error: "Public URL not provided" }, { status: 400 });
        }

        const shortId = nanoid(5);

        const { data, error } = await supabase
            .from("short_urls")
            .insert([{ shortId, originalUrl: publicUrl }]);

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ shortUrl: `https://flash-share.vercel.app/s/${shortId}` });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to create short URL" }, { status: 500 });
    }
}
