import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/client";

const supabase = createClient();

export async function GET(req: NextRequest) {
    const { pathname } = new URL(req.url);
    const shortId = pathname.split("/").pop(); 

    console.log("Short ID:", shortId); // Log shortId for debugging

    try {
        const { data, error } = await supabase
            .from("short_urls")
            .select("original_url")
            .eq("short_id", shortId)
            .single(); 

        if (error || !data) {
            console.error("Error fetching original URL:", error);
            return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
        }

        console.log("Original URL:", data.original_url); // Log original URL for debugging

        const originalUrl = data.original_url.startsWith("http")
            ? data.original_url
            : `https://${data.original_url}`;

        return NextResponse.redirect(originalUrl, 302); // Explicit 302 status code
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to redirect" }, { status: 500 });
    }
}
