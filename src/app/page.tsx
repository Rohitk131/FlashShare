"use client";


import { motion } from "framer-motion";
import Upload from "@/components/Upload";
import { AnimatedShinyTextDemo } from "@/components/CreatorButton";
import Link from "next/link";
export const runtime = 'edge'
export default function Home() {


  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-[1000px] h-[800px] rounded-full bg-gradient-to-b from-emerald-500/30 to-transparent blur-3xl" />
      <header className="mt-2 mx-4 relative py-6 px-4 sm:px-6 lg:px-8 justify-between bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-2xl border border-green-400/20 p-6 rounded-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-600 to-green-700 animate-pulse inline-block">
          Flash
          <span className="bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            Share
          </span>
        </h1>

        {/* Lightning bolt decorative element */}
        <div className="absolute top-3 left-5 text-green-400 text-lg animate-bounce">
          ⚡
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-12 ">
        <div className="lg:w-1/2 order-2 lg:order-1">
          <Upload />
        </div>

        <div className="lg:w-1/2 text-center lg:text-left order-1 lg:order-2 bg-black p-8 rounded-lg shadow-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-green-400 glow-effect "
          >
            Lightning-Fast File Transfers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 glow-effect "
          >
            Upload, generate a QR code, and share files instantly across
            devices.
          </motion.p>
          <style jsx>{`
            .glow-effect {
              text-shadow: 0 0 8px rgba(72, 255, 99, 0.8),
                0 0 16px rgba(72, 255, 99, 0.6);
              transition: text-shadow 0.3s ease-in-out;
            }
            .glow-effect:hover {
              text-shadow: 0 0 12px rgba(72, 255, 99, 1),
                0 0 24px rgba(72, 255, 99, 0.8);
            }
          `}</style>
        </div>
      </main>

      {/* Fixed button in the bottom right corner */}
      <div className="fixed bottom-0 right-4">
        <Link href='https://github.com/Rohitk131'>
        <AnimatedShinyTextDemo />
        </Link>
      </div>
    </div>
  );
}
