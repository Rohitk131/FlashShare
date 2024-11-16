'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { IconQrcode, IconCopy, IconDownload } from '@tabler/icons-react';
import { Moon, Sun } from 'lucide-react';
import { AnimatedShinyTextDemo } from '@/components/CreatorButton';
import { FloatingDockDemo } from '@/components/Dock';
import GenerateShortUrl from '@/lib/actionShortUrl';
import { createClient } from '@/lib/client';
import Confetti from 'react-confetti';

const supabase = createClient();

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white p-4 rounded-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()} 
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
export default function FlashShare() {
  const [noteContent, setNoteContent] = useState("# Welcome to FlashShare\n\nStart typing your note here...");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [shortUrl, setShortUrl] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [showQR, setShowQR] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleNoteChange = useCallback((value: string) => {
    setNoteContent(value);
  }, []);

  const handleShare = async () => {
    setLoading(true);
    try {
      if (!noteContent.trim()) {
        setError('Note content cannot be empty.');
        setLoading(false);
        return;
      }

      const fileName = `note-${Date.now()}.md`;
      const { data, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, new Blob([noteContent], { type: 'text/markdown' }));

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload note.');
      }

      const { data: publicUrlData } = await supabase.storage.from('files').getPublicUrl(data.path);

      const publicUrl = publicUrlData.publicUrl;
      setDataUrl(publicUrl);

      const shortURL = await GenerateShortUrl(publicUrl);
      setShortUrl(shortURL);

      setError('');
      setIsModalOpen(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error sharing note:', err.message);
        setError('Failed to share note. Please try again.');
      } else {
        console.error('Error sharing note:', err);
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl || dataUrl);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
      {/* Top Radial Gradient */}
      <div className="absolute -top-96 left-1/2 transform -translate-x-1/2 w-[1200px] h-[900px] rounded-full bg-gradient-to-b from-emerald-500/30 to-transparent blur-3xl" />

      <header className="mt-2 mx-4 relative py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center bg-secondary/15 shadow-lg shadow-neutral-600/5 backdrop-blur-2xl border border-green-400/20 p-6 rounded-2xl">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-600 to-green-700 animate-pulse inline-block">
          Flash
          <span className="bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
            Share
          </span>
        </h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5" />
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          <Moon className="h-5 w-5" />
        </div>
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
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Sharing...' : 'Share'}
            </Button>
          </div>
          <CodeMirror
            value={noteContent}
            height="500px"
            theme={isDarkMode ? vscodeDark : undefined}
            extensions={[markdown()]}
            onChange={handleNoteChange}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6 text-green-400">Note Shared Successfully!</h2>
        <div className="space-y-6">
          <div>
            <p className="text-gray-300 mb-2">Shareable Link:</p>
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
              <input
                type="text"
                value={shortUrl || dataUrl}
                readOnly
                className="bg-transparent text-white flex-grow outline-none"
              />
              <button onClick={copyToClipboard} className="text-green-400 hover:text-green-300 transition-colors" aria-label="Copy link">
                <IconCopy size={20} />
              </button>
              <button onClick={toggleQR} className="text-green-400 hover:text-green-300 transition-colors" aria-label="Toggle QR code">
                <IconQrcode size={20} />
              </button>
              <a
                href={dataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
                aria-label="Download note"
              >
                <IconDownload size={20} />
              </a>
            </div>
          </div>
          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center overflow-hidden"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    shortUrl || dataUrl
                  )}&color=4ADE80&bgcolor=1F2937`}
                  alt="QR Code"
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>

      <div className="fixed bottom-4 right-4">
        <Link href="https://github.com/Rohitk131">
          <AnimatedShinyTextDemo />
        </Link>
      </div>

      <div className="absolute -bottom-36 left-1/2 transform -translate-x-1/2 w-[1400px] h-[600px] rounded-t-full bg-gradient-to-t from-emerald-500/30 to-transparent blur-3xl" />

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}