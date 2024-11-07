import axios from 'axios';

export default async function generateShortUrl(publicUrl: string) {
  try {
    const response = await axios.post("/api/short-url", { publicUrl });
    // Ensure the response contains the expected data structure
    if (!response.data || !response.data.shortUrl) {
      throw new Error("Short URL not returned from the server");
    }
    return response.data.shortUrl;
  } catch (error) {
    console.error("Failed to generate short URL:", error);
    throw new Error("Error generating short URL: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}