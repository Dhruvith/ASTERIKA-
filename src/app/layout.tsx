import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AsterikaFX - Trading Journal for Forex & Day Traders",
  description:
    "AsterikaFX is a powerful trading journal designed for forex and day traders to track performance, analyze strategies, and become consistently profitable.",
  keywords: [
    "trading journal",
    "forex trading journal",
    "day trading journal",
    "trade tracker",
    "trading analytics",
    "forex trading",
    "trading performance",
    "prop firm trading",
    "trading psychology",
    "AsterikaFX",
  ],
  authors: [{ name: "AsterikaFX" }],
  openGraph: {
    title: "AsterikaFX - Trading Journal for Forex & Day Traders",
    description:
      "Track your trades, build discipline, and improve performance. A powerful trading journal for serious traders.",
    type: "website",
    locale: "en_US",
    siteName: "AsterikaFX",
  },
  twitter: {
    card: "summary_large_image",
    title: "AsterikaFX - Trading Journal",
    description:
      "Track your trades, build discipline, and improve performance. Join the growing community of traders.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0b1120" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
