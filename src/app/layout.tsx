import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Electrolize } from 'next/font/google'

const electrolize = Electrolize({
  weight: '400',
  subsets: ['latin'],
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Separate viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};
export const metadata: Metadata = {
  title: {
    default: "FlashShare - Fast & Secure File Sharing",
    template: "%s | FlashShare"
  },
  description: "Share files instantly with FlashShare. Secure, fast, and easy-to-use file sharing platform with QR code support and instant downloads.",
  keywords: [
    "file sharing",
    "secure file transfer",
    "quick share",
    "QR code sharing",
    "instant file upload",
    "cloud storage",
    "file hosting",
    "secure file hosting"
  ],
  authors: [
    {
      name: "Rohit Kumar",
      url: "https://your-website.com",
    }
  ],
  creator: "Rohit Kumar",
  publisher: "FlashShare",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flashshare.your-domain.com",
    title: "FlashShare - Fast & Secure File Sharing",
    description: "Share files instantly with FlashShare. Secure, fast, and easy-to-use file sharing platform with QR code support.",
    siteName: "FlashShare",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlashShare Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlashShare - Fast & Secure File Sharing",
    description: "Instantly share files with secure, fast, and easy-to-use platform featuring QR code support.",
    images: ["/og-image.png"],
    creator: "@gutsy_coder",
    site: "@rohitk.me",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
  category: "Technology",
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "your-google-site-verification-code",
  },
  applicationName: "FlashShare",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FlashShare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${electrolize.className} antialiased bg-black`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}