import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import Providers from "@/components/Providers";
import { SpeedInsights } from "@vercel/speed-insights/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nola Nail Art and Beauty",
  description: "Beauty in every detail. Nail art and beauty studio that is personal, tidy, and elegant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Providers>
          <Navbar />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <FloatingCTA />
          <Footer />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
