import { useState } from 'react'
import { Zap, Lock, QrCode } from 'lucide-react'

export default function Component() {
  const features = [
    { 
      title: "Lightning-Fast File Transfers", 
      description: "Upload, generate a QR code, and share files instantly across devices.",
      icon: Zap
    },
    { 
      title: "Secure Encryption", 
      description: "Your files are protected with end-to-end encryption during transfers.",
      icon: Lock
    },
    { 
      title: "Easy QR Sharing", 
      description: "Generate QR codes for your files and share effortlessly with nearby devices.",
      icon: QrCode
    },
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon: Icon }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden rounded-lg h-40 transition-transform transform hover:scale-105 duration-300 ease-in-out bg-gradient-to-b from-emerald-500/20 to-transparent p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgb(5,135,67), 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />
      <div className="relative h-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <Icon className="text-green-400 w-32 h-32" />
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-1">{title}</h3>
            <p className="text-green-300 text-sm md:text-base">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
