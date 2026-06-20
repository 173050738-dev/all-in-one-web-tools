import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PDF Tools - Local Processing, Private & Secure Online PDF Tools",
  description:
    "Free online PDF compression, merge, split, to-Word, batch rename tools. All processing happens locally in your browser - files never leave your device.",
  keywords: [
    "pdf tools",
    "compress pdf online",
    "merge pdf",
    "split pdf",
    "pdf to word",
    "batch rename pdf",
    "local pdf processing",
    "pdf drawing rename",
  ],
  openGraph: {
    title: "PDF Tools - Local Processing, Private & Secure Online PDF Tools",
    description: "Free online PDF compression, merge, split, to-Word, batch rename tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
