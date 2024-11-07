import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/client";

const supabase = createClient();

export async function GET(req: NextRequest) {
    // Extract the shortId from the request URL
    const { pathname } = new URL(req.url);
    const shortId = pathname.split("/").pop(); // Get the last part of the URL

    try {
        // Query the short_urls table for the original URL using the shortId
        const { data, error } = await supabase
            .from("short_urls")
            .select("original_url")
            .eq("short_id", shortId)
            .single(); // Get a single record

        if (error || !data) {
            console.error("Error fetching original URL:", error);
            return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
        }

        // Redirect to the original URL
        return NextResponse.redirect(data.original_url);
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to redirect" }, { status: 500 });
    }
}