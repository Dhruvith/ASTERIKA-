"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    Newspaper, 
    Zap, 
    ArrowRight,
    Search,
    Calendar,
    User
} from "lucide-react";
import { Button, BackgroundBeams, Badge } from "@/components/ui";
import { useNews } from "@/hooks/useNews";
import { formatDate, cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function UpdatesPage() {
    const { news, loading } = useNews(true);
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredNews = news.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dark min-h-screen bg-[#020617] text-foreground font-sans selection:bg-primary/30">
            <BackgroundBeams />
            
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-[#020617]/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-primary/5 border border-primary/20 p-2 rounded-xl backdrop-blur-sm group hover:border-primary/40 transition-all duration-300">
                            <Image
                                src="/asterika_logo.png"
                                alt="AsterikaFX Logo"
                                width={140}
                                height={36}
                                className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" className="text-muted-foreground hover:text-white flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-20 relative z-10">
                {/* Hero Section */}
                <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-20">
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 border-primary/20 bg-primary/5 text-primary uppercase tracking-[0.2em] font-black text-xs">
                        Platform Updates
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                        News & Insights
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Stay up to date with the latest features, improvements, and trading insights from the AsterikaFX team.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    {...fadeInUp}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto mb-20"
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search articles, updates, news..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-lg placeholder:text-muted-foreground/40"
                        />
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : filteredNews.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 max-w-2xl mx-auto">
                        <Newspaper className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No updates found</h3>
                        <p className="text-muted-foreground">Try adjusting your search criteria or come back later.</p>
                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 text-primary">Clear search</Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
                            >
                                <div className="aspect-[16/10] relative overflow-hidden text-[#020617]">
                                    {item.coverImage ? (
                                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                                            <Zap className="w-16 h-16 text-primary/20" />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <Badge className={cn(
                                            "uppercase text-[10px] font-black tracking-widest px-3 py-1 border-0 shadow-lg",
                                            item.category === 'update' ? "bg-emerald-500 text-white" :
                                            item.category === 'news' ? "bg-blue-500 text-white" :
                                            item.category === 'blog' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                                        )}>
                                            {item.category}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            {formatDate(item.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-primary" />
                                            {item.author}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-8 flex-1">
                                        {item.body}
                                    </p>
                                    <Link href={`/updates/${item.id}`} className="inline-flex items-center gap-2 text-primary font-bold group/link">
                                        Read Article 
                                        <div className="p-2 rounded-full bg-primary/10 group-link-hover:bg-primary group-link-hover:text-black transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-20 mt-20 border-t border-white/5 relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground text-sm">© 2026 AsterikaFX. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
