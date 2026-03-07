"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart2,
  BookOpen,
  Brain,
  CheckCircle2,
  ArrowRight,
  Users,
  Star,
  Sparkles,
  Target,
  ChevronRight,
  Eye,
  AlertTriangle,
  LineChart,
  Trophy,
  Zap,
  Gift,
  Rocket,
} from "lucide-react";
import { Button, BackgroundBeams } from "@/components/ui";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background font-sans flex flex-col relative overflow-hidden text-foreground">
      <BackgroundBeams />

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/asterika_logo.png"
              alt="AsterikaFX Logo"
              width={180}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors duration-300">Features</Link>
            <Link href="#why" className="hover:text-primary transition-colors duration-300">Why AsterikaFX</Link>
            <Link href="#who" className="hover:text-primary transition-colors duration-300">Who It&apos;s For</Link>
            <Link href="#beta" className="hover:text-primary transition-colors duration-300">Early Access</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary text-sm font-semibold px-5 py-2.5" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 text-sm font-semibold px-5 py-2.5">Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className="relative pt-28 pb-36 overflow-hidden border-b border-border z-10">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-8 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            🚀 Beta Open — First 2000 Users Get Free Premium Access
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-balance leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground">
              Track Your Trades.
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground">
              Build Discipline.
            </span>
            <br />
            <span className="text-primary green-glow-text">
              Improve Performance.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed text-balance"
          >
            AsterikaFX is a powerful trading journal designed for forex and day traders
            to track performance, analyze strategies, and become consistently profitable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 h-14 px-10 text-lg font-bold rounded-xl transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
              >
                Start Free Trading Journal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#beta">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-semibold border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Join Free Beta — First 2000 Users
              </Button>
            </Link>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 relative max-w-5xl mx-auto rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden group green-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="p-3 border-b border-border bg-card/80 flex items-center gap-3 h-12">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="h-5 flex-1 max-w-sm bg-secondary/50 rounded-full mx-auto" />
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-6 md:p-8 bg-background/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total P&L", value: "+$12,485", color: "text-green-400" },
                  { label: "Win Rate", value: "68.5%", color: "text-primary" },
                  { label: "Avg RR", value: "1:2.4", color: "text-primary" },
                  { label: "Total Trades", value: "247", color: "text-foreground" },
                ].map((stat, i) => (
                  <div key={i} className="bg-card/60 border border-border rounded-xl p-4 text-left">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-48 md:h-64 bg-card/40 border border-border rounded-xl relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-primary/10 to-transparent" />
                {/* Simulated chart line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.4)"
                    strokeWidth="2"
                    points="0,180 30,160 60,150 90,120 120,140 150,100 180,110 210,70 240,90 270,60 300,50 330,40 360,55 400,30"
                  />
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                  </linearGradient>
                  <polygon
                    fill="url(#chartGrad)"
                    points="0,180 30,160 60,150 90,120 120,140 150,100 180,110 210,70 240,90 270,60 300,50 330,40 360,55 400,30 400,200 0,200"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 2: THE PROBLEM ==================== */}
      <section className="py-28 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-destructive/10 border border-destructive/20 px-4 py-1.5 text-sm font-semibold text-red-400 mb-6">
              <AlertTriangle className="w-4 h-4 mr-2" />
              The Hard Truth
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Most Traders Fail Because They Don&apos;t Track Their Trades
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Successful traders track every trade they make. But most traders rely on memory instead of data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            {/* Problem Side */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card/50 border border-border rounded-2xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-400" />
                Without tracking, you can&apos;t understand:
              </h3>
              <div className="space-y-4">
                {[
                  "Why you win",
                  "Why you lose",
                  "Which strategies actually work",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...stagger}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Solution Side */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-8 backdrop-blur-sm green-glow"
            >
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AsterikaFX is the solution
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                AsterikaFX helps you turn your trading activity into actionable insights.
                Track every trade, analyze patterns, and make data-driven decisions.
              </p>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                Data-driven improvement starts here
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: KEY FEATURES ==================== */}
      <section id="features" className="py-28 bg-card/30 relative z-10 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Everything You Need to Improve Your Trading
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: "Trade Journal",
                desc: "Log every trade with entry, exit, strategy, and notes. Keep a detailed record of every decision you make in the market.",
                gradient: "from-primary/20 to-emerald-500/10",
              },
              {
                icon: <LineChart className="w-7 h-7" />,
                title: "Performance Dashboard",
                desc: "Track key metrics including Total P&L, Win Rate, Average Risk Reward, and Total Trades — all in real-time.",
                gradient: "from-primary/20 to-teal-500/10",
                metrics: ["Total P&L", "Win Rate", "Avg Risk Reward", "Total Trades"],
              },
              {
                icon: <Brain className="w-7 h-7" />,
                title: "Trading Psychology Journal",
                desc: "Record your emotions, mistakes, and lessons from each trading session. Master the mental game of trading.",
                gradient: "from-primary/20 to-cyan-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="group relative bg-card/60 border border-border rounded-2xl p-8 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{feature.desc}</p>
                  {feature.metrics && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {feature.metrics.map((m, j) => (
                        <div key={j} className="text-xs font-medium text-primary bg-primary/10 rounded-lg px-3 py-1.5 text-center border border-primary/20">
                          {m}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: WHY ASTERIKAFX ==================== */}
      <section id="why" className="py-28 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
                <Target className="w-4 h-4 mr-2" />
                Our Edge
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                Built for Serious Traders
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                AsterikaFX is designed to help traders develop discipline, consistency,
                and data-driven decision making.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Unlike complicated trading journals, AsterikaFX focuses on
                <span className="text-primary font-semibold"> simplicity and clarity</span>.
              </p>
              <div className="bg-card/50 border border-primary/20 rounded-xl p-6 green-glow">
                <p className="text-foreground font-semibold text-lg mb-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Our goal is simple:
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Help traders improve their performance through better tracking and analysis.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <Target className="w-6 h-6" />, label: "Discipline", desc: "Build consistent habits" },
                { icon: <BarChart2 className="w-6 h-6" />, label: "Data-Driven", desc: "Make informed decisions" },
                { icon: <Sparkles className="w-6 h-6" />, label: "Simplicity", desc: "No unnecessary complexity" },
                { icon: <TrendingUp className="w-6 h-6" />, label: "Performance", desc: "Measurable improvement" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="bg-card/60 border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: WHO IT'S FOR ==================== */}
      <section id="who" className="py-28 bg-card/30 relative z-10 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
              <Users className="w-4 h-4 mr-2" />
              Our Community
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Who Uses AsterikaFX
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { icon: <TrendingUp className="w-6 h-6" />, label: "Forex Traders" },
              { icon: <Zap className="w-6 h-6" />, label: "Day Traders" },
              { icon: <Star className="w-6 h-6" />, label: "Prop Firm Traders" },
              { icon: <LineChart className="w-6 h-6" />, label: "Swing Traders" },
              { icon: <BookOpen className="w-6 h-6" />, label: "Trading Students" },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="bg-card/60 border border-border rounded-xl p-6 text-center hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Whether you are just starting or already trading funded accounts,
            AsterikaFX helps you track and improve your trading performance.
          </motion.p>
        </div>
      </section>

      {/* ==================== SECTION 6: EARLY ACCESS ==================== */}
      <section id="beta" className="py-28 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-card/80 to-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden green-glow"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-sm font-semibold text-primary mb-8">
                <Gift className="w-4 h-4 mr-2" />
                Limited Time Offer
              </div>

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
                Join the AsterikaFX Beta
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                We are currently offering early access to traders who want to improve
                their trading performance. Be among the first to experience the future of trade journaling.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                {[
                  "Free access to premium features during beta",
                  "Priority feature updates",
                  "Lifetime early adopter benefits",
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    {...stagger}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 bg-card/60 border border-border rounded-lg p-3 text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-muted-foreground text-left">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 h-14 px-12 text-lg font-bold rounded-xl transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
                >
                  Get Free Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 7: VISION ==================== */}
      <section className="py-28 bg-card/30 relative z-10 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-8">
              <Rocket className="w-4 h-4 mr-2" />
              Our Vision
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Our Vision
            </h2>

            <div className="bg-card/60 border border-border rounded-2xl p-8 md:p-12 backdrop-blur-sm">
              <p className="text-xl md:text-2xl text-foreground font-semibold mb-6 leading-relaxed">
                AsterikaFX aims to become the
                <span className="text-primary"> operating system</span> for retail traders.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to provide traders with the tools they need to track performance,
                improve discipline, and achieve long-term profitability.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 8: FINAL CTA ==================== */}
      <section className="py-32 bg-background relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground">
              Start Tracking Your Trades Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Join the growing community of traders using AsterikaFX to improve
              their trading performance.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 h-16 px-14 text-xl font-bold rounded-xl transition-all duration-300 hover:shadow-primary/40 hover:scale-105"
              >
                Start Free
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 bg-card/30 border-t border-border relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/asterika_logo.png"
              alt="AsterikaFX"
              width={140}
              height={36}
              className="h-9 w-auto"
            />
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AsterikaFX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
