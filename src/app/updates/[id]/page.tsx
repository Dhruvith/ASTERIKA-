"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
    ChevronLeft, 
    Clock, 
    Calendar, 
    User, 
    Share2, 
    Twitter, 
    Linkedin, 
    ArrowLeft,
    Newspaper,
    Zap,
    ExternalLink
} from "lucide-react";
import { Button, BackgroundBeams, Badge } from "@/components/ui";
import { useNews } from "@/hooks/useNews";
import { formatDate, cn } from "@/lib/utils";
import { NewsEntry } from "@/types/news";

export default function UpdateDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { news, loading } = useNews(true);
    const [entry, setEntry] = useState<NewsEntry | null>(null);

    useEffect(() => {
        if (!loading && news.length > 0) {
            const found = news.find(n => n.id === id);
            if (found) {
                setEntry(found);
            } else {
                router.push("/updates");
            }
        }
    }, [id, news, loading, router]);

    if (loading || !entry) {
        return (
            <div className="dark min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Newspaper className="w-12 h-12 text-primary animate-pulse" />
                    <p className="text-muted-foreground animate-pulse">Loading article...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dark min-h-screen bg-[#020617] text-foreground font-sans selection:bg-primary/30 pb-32">
            <BackgroundBeams />
            
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <Link href="/updates">
                        <Button variant="ghost" className="text-muted-foreground hover:text-white flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            All Updates
                        </Button>
                    </Link>
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-primary/5 border border-primary/20 p-2 rounded-xl backdrop-blur-sm group hover:border-primary/40 transition-all duration-300">
                            <Image
                                src="/asterika_logo.png"
                                alt="AsterikaFX Logo"
                                width={120}
                                height={32}
                                className="h-7 w-auto"
                            />
                        </div>
                    </Link>
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-white/10 hover:border-white/30 text-xs font-bold uppercase tracking-widest text-primary">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-12 relative z-10">
                <article className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-12 uppercase tracking-widest font-black">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronLeft className="w-3 h-3 rotate-180" />
                        <Link href="/updates" className="hover:text-primary transition-colors">Updates</Link>
                        <ChevronLeft className="w-3 h-3 rotate-180 text-primary" />
                        <span className="text-white truncate max-w-[200px]">{entry.title}</span>
                    </nav>

                    {/* Meta */}
                    <div className="mb-10">
                        <Badge className={cn(
                            "mb-6 px-4 py-1.5 border-0 uppercase tracking-widest font-black text-xs",
                            entry.category === 'update' ? "bg-emerald-500 text-white" :
                            entry.category === 'news' ? "bg-blue-500 text-white" :
                            entry.category === 'blog' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                        )}>
                            {entry.category}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 text-white leading-[1.1]">
                            {entry.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-10 py-8 border-y border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/40 transition-all">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Author</span>
                                    <span className="text-white font-bold">{entry.author}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group hover:border-primary/40 transition-all">
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Date</span>
                                    <span className="text-white font-bold">{formatDate(entry.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    {entry.coverImage && (
                        <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden mb-16 shadow-2xl shadow-primary/10 border border-white/5">
                            <img 
                                src={entry.coverImage} 
                                alt={entry.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none text-xl leading-[1.8] font-medium text-white/80 space-y-8">
                        {entry.body.split('\n').map((para, i) => (
                            para.trim() ? <p key={i}>{para}</p> : <div key={i} className="h-4" />
                        ))}
                    </div>

                    {/* Footer / CTA */}
                    <div className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 text-[#020617]">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" className="w-14 h-14 rounded-full border-white/10 hover:border-primary/40 p-0 text-white hover:text-primary transition-all">
                                <Twitter className="w-6 h-6" />
                            </Button>
                            <Button variant="outline" className="w-14 h-14 rounded-full border-white/10 hover:border-primary/40 p-0 text-white hover:text-primary transition-all">
                                <Linkedin className="w-6 h-6" />
                            </Button>
                            <Button variant="outline" className="w-14 h-14 rounded-full border-white/10 hover:border-primary/40 p-0 text-white hover:text-primary transition-all">
                                <Share2 className="w-6 h-6" />
                            </Button>
                        </div>
                        <Link href="/signup">
                            <Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/90 text-black font-black text-lg rounded-2xl shadow-xl shadow-primary/20">
                                Start Your Trading Journal
                            </Button>
                        </Link>
                    </div>
                </article>

                {/* Navigation */}
                <div className="max-w-4xl mx-auto mt-32">
                    <Link href="/updates">
                        <div className="group flex items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-[32px] hover:border-primary/40 transition-all duration-500">
                             <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                <ArrowLeft className="w-6 h-6" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">Go Back</span>
                                <span className="text-2xl font-bold text-white">Back to all updates</span>
                             </div>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
