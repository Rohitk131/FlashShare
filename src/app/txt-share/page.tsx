"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatedShinyTextDemo } from "@/components/CreatorButton"
import { FloatingDockDemo } from '@/components/Dock'
import { Button } from "@/components/ui/button"

export default function Home() {
  const [noteContent, setNoteContent] = useState("")

  const handleShare = () => {
    // Implement your share functionality here
    console.log("Sharing note:", noteContent)
    // You could open a modal, copy to clipboard, or send to an API
  }

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

        {/* Lightning bolt decorative element */}
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
      Share
    </Button>
  </div>
  <textarea
    className="w-full h-[300px] bg-gray-900 p-6 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-b-xl"
    placeholder="Start typing your note here..."
    style={{
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
      border: '1px solid #404040',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}
    value={noteContent}
    onChange={(e) => setNoteContent(e.target.value)}
  />
</div>

      </main>

      {/* Fixed button in the bottom right corner */}
      <div className="fixed bottom-4 right-4">
        <Link href="https://github.com/Rohitk131">
          <AnimatedShinyTextDemo />
        </Link>
      </div>

      {/* Bottom Hemisphere Gradient */}
      <div className="absolute -bottom-36 left-1/2 transform -translate-x-1/2 w-[1400px] h-[600px] rounded-t-full bg-gradient-to-t from-emerald-500/30 to-transparent blur-3xl" />
    </div>
  )
}