import axios from 'axios'

export default async function generateShortUrl(publicUrl: string) {
  try {
    const response = await axios.post("/api/short-url", { publicUrl });
    return response.data.shortUrl;
  } catch (error) {
    console.error("Failed to generate short URL:", error);
    throw new Error("Error generating short URL");
  }
}