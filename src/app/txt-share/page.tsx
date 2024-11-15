"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedShinyTextDemo } from "@/components/CreatorButton";
import { FloatingDockDemo } from "@/components/Dock";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { IconQrcode, IconCopy, IconDownload } from "@tabler/icons-react";
import GenerateShortUrl from "@/lib/actionShortUrl";
import { createClient } from '@/lib/client';

const supabase = createClient();

export default function Home() {
  const [noteContent, setNoteContent] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [dataUrl, setDataUrl] = useState(""); 
  const [showQR, setShowQR] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      if (!noteContent.trim()) {
        setError("Note content cannot be empty.");
        setLoading(false);
        return;
      }
  
      // Generate a unique file name for the note
      const fileName = `note-${Date.now()}.txt`;
  
      // Upload the note content to the 'files' bucket
      const { data, error: uploadError } = await supabase.storage
        .from("files") // Using 'files' bucket
        .upload(fileName, new Blob([noteContent], { type: "text/plain" }));
  
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload note.");
      }
  
      // Retrieve the public URL for the uploaded file
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("files")
        .getPublicUrl(data.path);
  
      if (publicUrlError) {
        console.error("Public URL retrieval error:", publicUrlError);
        throw new Error("Failed to retrieve public URL.");
      }
  
      const publicUrl = publicUrlData.publicUrl;
      setDataUrl(publicUrl);
  
      // Optionally generate a short URL
      const shortURL = await GenerateShortUrl(publicUrl);
      setShortUrl(shortURL);
  
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error sharing note:", err.message || err);
      setError("Failed to share note. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl || dataUrl);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Top Radial Gradient */}
      <div className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-[1200px] h-[900px] rounded-full bg-gradient-to-b from-emerald-500/30 to-transparent blur-3xl" />

      <header className="mt-2 mx-4 relative py-6 px-4 sm:px-6 lg:px-8 flex justify-between bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-2xl border border-green-400/20 p-6 rounded-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-600 to-green-700 animate-pulse inline-block">
          Flash
          <span className="bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            Share
          </span>
        </h1>

        <div className="absolute top-3 left-5 text-green-400 text-lg animate-bounce">
          <Image src="/bolt.png" width={20} height={20} alt="bolt image" />
        </div>
      </header>

      <main className="container mx-auto px-4 pt-16 flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-16">
        <FloatingDockDemo />

        <div className="w-full max-w-8xl bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-lg font-medium text-gray-200">Notepad</h2>
            <Button
              onClick={handleShare}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-md transition-all"
            >
              {loading ? "Sharing..." : "Share"}
            </Button>
          </div>
          <textarea
            className="w-full h-[300px] bg-gray-900 p-6 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-b-xl"
            placeholder="Start typing your note here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />

          {dataUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="flex flex-col gap-4 p-4 bg-neutral-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-neutral-300">Access Raw Data:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      <IconCopy className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      onClick={toggleQR}
                      className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      <IconQrcode className="w-5 h-5 text-green-500" />
                    </button>
                    <a
                      href={dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                    >
                      <IconDownload className="w-5 h-5 text-green-500" />
                    </a>
                  </div>
                </div>

                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="w-full bg-neutral-800 text-green-300 p-2 rounded-md text-sm"
                />

                {showQR && (
                  <div className="flex justify-center m-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        shortUrl || dataUrl
                      )}&color=42C773&bgcolor=000000`}
                      alt="QR Code"
                      className="w-48 h-48 rounded-3xl p-2 border-2 border-green-400"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </main>

      <div className="fixed bottom-4 right-4">
        <Link href="https://github.com/Rohitk131">
          <AnimatedShinyTextDemo />
        </Link>
      </div>

      <div className="absolute -bottom-36 left-1/2 transform -translate-x-1/2 w-[1400px] h-[600px] rounded-t-full bg-gradient-to-t from-emerald-500/30 to-transparent blur-3xl" />
    </div>
  );
}
