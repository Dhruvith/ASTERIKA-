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
  title: "Asterika - Premium Trading Journal & Analytics",
  description:
    "The intelligent trading journal that transforms your trading data into actionable insights. Track trades, analyze performance, and improve your edge.",
  keywords: [
    "trading journal",
    "trade tracker",
    "trading analytics",
    "stock trading",
    "forex trading",
    "crypto trading",
    "trading performance",
  ],
  authors: [{ name: "Asterika" }],
  openGraph: {
    title: "Asterika - Premium Trading Journal & Analytics",
    description:
      "The intelligent trading journal that transforms your trading data into actionable insights.",
    type: "website",
    locale: "en_US",
    siteName: "Asterika",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asterika - Premium Trading Journal",
    description:
      "Transform your trading data into actionable insights. Built for serious traders.",
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
        <meta name="theme-color" content="#020617" />
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
