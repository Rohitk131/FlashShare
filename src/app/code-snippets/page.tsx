"use client"


import Link from "next/link"
import Image from "next/image"
import { AnimatedShinyTextDemo } from "@/components/CreatorButton"
import { FloatingDockDemo } from '@/components/Dock'

import CodeEditor from "@/components/CodeEditor"; 

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Top Radial Gradient */}
      <div className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-[1200px] h-[900px] rounded-full bg-gradient-to-b from-emerald-500/30 to-transparent blur-3xl" />

      <header className="container mx-auto mt-2  relative py-6 px-4 sm:px-6 lg:px-8 flex justify-between bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-2xl border border-green-400/20 p-6 rounded-2xl">
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

        <CodeEditor/>

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