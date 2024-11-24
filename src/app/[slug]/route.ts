import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/client";

const supabase = createClient();

export async function GET(req: NextRequest) {
    const { pathname } = new URL(req.url);
    const shortId = pathname.split("/").pop();

    console.log("Short ID:", shortId); // Debugging

    try {
        const { data, error } = await supabase
            .from("short_urls")
            .select("original_url, title, description, image_url")
            .eq("short_id", shortId)
            .single();

        if (error || !data) {
            console.error("Error fetching original URL:", error);
            return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
        }

        const { original_url: originalUrl, title, description, image_url: imageUrl } = data;

        // Check if the request is from a crawler
        const userAgent = req.headers.get("user-agent") || "";
        const isBot = /bot|crawl|spider|facebook|twitter|whatsapp/i.test(userAgent);

        if (isBot) {
            // Serve metadata for bots/crawlers
            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta property="og:title" content="${title || 'Default Title'}" />
                    <meta property="og:description" content="${description || 'Default Description'}" />
                    <meta property="og:image" content="${imageUrl || 'https://default.image.url/placeholder.jpg'}" />
                    <meta property="og:url" content="${originalUrl}" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="${title || 'Default Title'}" />
                    <meta name="twitter:description" content="${description || 'Default Description'}" />
                    <meta name="twitter:image" content="${imageUrl || 'https://default.image.url/placeholder.jpg'}" />
                </head>
                <body>
                    <h1>Redirecting to ${originalUrl}</h1>
                </body>
                </html>
            `;
            return new Response(html, {
                headers: { "Content-Type": "text/html" },
            });
        }

        // Redirect for browsers
        const redirectUrl = originalUrl.startsWith("http")
            ? originalUrl
            : `https://${originalUrl}`;
        return NextResponse.redirect(redirectUrl, 302);
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to redirect" }, { status: 500 });
    }
}
