'use client';

import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { IconQrcode, IconCopy, IconDownload, IconX } from '@tabler/icons-react';
import { Moon, Sun } from 'lucide-react';
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative shadow-2xl border border-gray-700"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <IconX size={24} />
          </button>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function CodeEditorNoteSharing() {
  const [code, setCode] = useState("console.log('Hello, World!');");
  const [language, setLanguage] = useState('javascript');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [shortUrl, setShortUrl] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [showQR, setShowQR] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);

    const defaultCode = {
      javascript: "console.log('Hello, World!');",
      python: "print('Hello, World!')",
      java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      rust: 'fn main() {\n    println!("Hello, World!");\n}',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      php: '<?php\necho "Hello, World!";\n?>',
    }[value];
    setCode(defaultCode || '// Start coding here');
  };

  const getLanguageMode = () => {
    const modes = {
      javascript: javascript({ jsx: true }),
      python: python(),
      java: java(),
      cpp: cpp(),
      rust: rust(),
      go: go(),
      php: php(),
    };
    return modes[language as keyof typeof modes] || javascript({ jsx: true });
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      if (!code.trim()) {
        setError('Code cannot be empty.');
        setLoading(false);
        return;
      }

      const fileName = `code-${Date.now()}.txt`;
      const { data, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, new Blob([code], { type: 'text/plain' }));

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload code.');
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
        console.error('Error sharing code:', err.message);
        setError('Failed to share code. Please try again.');
      } else {
        console.error('Error sharing code:', err);
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
    <div className={`w-full min-h-screen text-white relative`}>
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
      <header className="flex justify-between items-center p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-green-500">Code Editor & Share</h1>
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5" />
          <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          <Moon className="h-5 w-5" />
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Select onValueChange={handleLanguageChange} value={language}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div>
        <CodeMirror
          value={code}
          height="500px"
          theme={isDarkMode ? vscodeDark : undefined}
          extensions={[getLanguageMode()]}
          onChange={handleCodeChange}
          className="rounded-lg overflow-hidden"
        />

        {error && <p className="text-red-500">{error}</p>}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-6 text-green-400">Code Shared Successfully!</h2>
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
                  aria-label="Download code"
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
      </main>
    </div>
  );
}