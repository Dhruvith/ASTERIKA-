"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, BarChart2, ShieldCheck, Zap, ArrowRight, LayoutDashboard, Globe } from "lucide-react";
import { Button, BackgroundBeams, BentoGrid, BentoGridItem, MovingBorderButton } from "@/components/ui";

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background font-sans flex flex-col relative overflow-hidden text-foreground">
      <BackgroundBeams />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Asterika</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-border z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            v2.0 Now Available with AI Analytics
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-balance bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground"
          >
            The Professional Standard for <br className="hidden lg:block" />
            <span className="text-primary">Trading Performance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-balance"
          >
            Stop trading blindly. Asterika provides institutional-grade analytics,
            AI-driven insights, and automated journaling for serious traders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/signup">
              <MovingBorderButton
                borderRadius="0.5rem"
                className="bg-card text-foreground border-border font-semibold text-lg"
                duration={3000}
              >
                Start Tracking Free
              </MovingBorderButton>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base border-border hover:bg-secondary text-muted-foreground hover:text-foreground">
                View Live Demo
              </Button>
            </Link>
          </motion.div>

          {/* Dashboard Preview - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-24 relative max-w-6xl mx-auto rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden perspective-1000 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="p-4 border-b border-border bg-card/80 flex items-center justify-between h-14">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" /> {/* Keeping yellow-500 as there's no direct semantic equivalent like 'warning' in the provided list */}
                <div className="w-3 h-3 rounded-full bg-green-500/50" /> {/* Keeping green-500 as there's no direct semantic equivalent like 'success' in the provided list */}
              </div>
              <div className="h-6 w-96 bg-secondary/50 rounded-full mx-auto hidden md:block"></div>
            </div>

            {/* Mock UI Content */}
            <div className="grid grid-cols-12 h-[600px] bg-background/40">
              {/* Sidebar Mock */}
              <div className="col-span-1 lg:col-span-2 border-r border-border p-6 space-y-6 hidden md:block">
                <div className="h-8 w-10 lg:w-3/4 bg-secondary rounded animate-pulse" />
                <div className="space-y-4 pt-4">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-4 w-full bg-secondary/50 rounded" />)}
                </div>
              </div>
              {/* Main Content Mock */}
              <div className="col-span-12 md:col-span-11 lg:col-span-10 p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="space-y-2">
                    <div className="h-8 w-64 bg-secondary rounded" />
                    <div className="h-4 w-40 bg-secondary/50 rounded" />
                  </div>
                  <div className="h-10 w-32 bg-primary/20 rounded border border-primary/50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-card/50 border border-border rounded-xl p-6 relative overflow-hidden group/card">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="h-5 w-1/2 bg-secondary rounded mb-4" />
                      <div className="h-10 w-3/4 bg-secondary/50 rounded" />
                    </div>
                  ))}
                </div>
                <div className="h-80 bg-card/50 border border-border rounded-xl relative">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Aceternity Bento Grid */}
      <section id="features" className="py-32 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Precision Tools for Modern Markets
            </h2>
            <p className="text-muted-foreground text-lg">
              Built by traders, for traders. We understand what you need to succeed.
            </p>
          </div>

          <BentoGrid>
            {[
              {
                icon: <BarChart2 className="w-6 h-6 text-primary" />,
                title: "Deep Analytics",
                desc: "Visualize your edge with equity curves, win/loss ratios, and drawdown analysis.",
                header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-card to-secondary border border-border" />
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-primary" />,
                title: "Risk Management",
                desc: "Automated risk alerts help you stay disciplined and protect your capital.",
                header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-card to-secondary border border-border" />
              },
              {
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: "Instant Sync",
                desc: "Connect with MetaTrader, cTrader, and major crypto exchanges via API.",
                header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-card to-secondary border border-border" />
              },
              {
                icon: <LayoutDashboard className="w-6 h-6 text-primary" />,
                title: "Custom Dashboard",
                desc: "Drag and drop widgets to create your perfect trading command center.",
                header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-card to-secondary border border-border" />
              },
              {
                icon: <Globe className="w-6 h-6 text-primary" />,
                title: "Market Context",
                desc: "Integrated economic calendar and news feed keep you synced with global events.",
                header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-card to-secondary border border-border" />
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-primary" />,
                title: "Strategy Testing",
                desc: "Tag trades by strategy to identify what's working and what isn't.",
                header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-card to-secondary border border-border" />
              }
            ].map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.desc}
                header={item.header}
                icon={item.icon}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Asterika</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Asterika Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
