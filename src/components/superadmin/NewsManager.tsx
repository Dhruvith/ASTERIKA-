"use client";

import React, { useState } from "react";
import { useNews } from "@/hooks/useNews";
import { NewsEntry, NewsEntryInput } from "@/types/news";
import { 
    Plus, 
    Trash2, 
    Edit, 
    CheckCircle2, 
    XCircle, 
    Image as ImageIcon,
    Loader2,
    Search,
    Newspaper,
    ExternalLink,
    ChevronRight,
    Eye
} from "lucide-react";
import { 
    Button, 
    Card, 
    Input, 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    Badge,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";

export function NewsManager() {
    const { news, loading, createNewsEntry, updateNewsEntry, deleteNewsEntry } = useNews(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [form, setForm] = useState<NewsEntryInput>({
        title: "",
        body: "",
        category: "update",
        coverImage: "",
        published: true,
        author: "Asterika Team"
    });

    const handleOpenModal = (entry?: NewsEntry) => {
        if (entry) {
            setEditingId(entry.id);
            setForm({
                title: entry.title,
                body: entry.body,
                category: entry.category,
                coverImage: entry.coverImage || "",
                published: entry.published,
                author: entry.author
            });
        } else {
            setEditingId(null);
            setForm({
                title: "",
                body: "",
                category: "update",
                coverImage: "",
                published: true,
                author: "Asterika Team"
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.title || !form.body) return;
        setIsSubmitting(true);
        try {
            if (editingId) {
                await updateNewsEntry(editingId, form);
            } else {
                await createNewsEntry(form);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save news entry:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this news entry?")) {
            await deleteNewsEntry(id);
        }
    };

    const filteredNews = news.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search news, updates, blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Entry
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800/50 border-dashed">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                    <p className="text-slate-400 text-sm">Loading news archive...</p>
                </div>
            ) : filteredNews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800/50 border-dashed">
                    <Newspaper className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-400 font-medium">No results found</p>
                    <p className="text-slate-600 text-sm">Try a different search or create a new entry</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredNews.map((entry) => (
                        <Card key={entry.id} className="p-0 overflow-hidden bg-slate-900/50 border-slate-800 group hover:border-emerald-500/30 transition-all">
                            <div className="flex">
                                {entry.coverImage && (
                                    <div className="w-32 sm:w-48 relative overflow-hidden shrink-0 border-r border-slate-800/50">
                                        <img src={entry.coverImage} alt={entry.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="p-5 flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] uppercase font-black tracking-widest",
                                                entry.category === "update" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                entry.category === "news" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                entry.category === "blog" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                            )}>
                                                {entry.category}
                                            </Badge>
                                            {entry.published ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-0 flex items-center gap-1 text-[10px]">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Published
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-slate-800 text-slate-400 border-0 flex items-center gap-1 text-[10px]">
                                                    <XCircle className="w-2.5 h-2.5" /> Draft
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => handleOpenModal(entry)}
                                                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(entry.id)}
                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors text-lg">
                                        {entry.title}
                                    </h4>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                        {entry.body}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                        <div className="text-[10px] text-slate-500">
                                            By {entry.author} • {formatDate(entry.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                                            View <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <Newspaper className="w-6 h-6 text-emerald-400" />
                            {editingId ? "Edit Entry" : "Create News Entry"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                                <Select 
                                    value={form.category} 
                                    onValueChange={(v: any) => setForm({ ...form, category: v })}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        <SelectItem value="update">Update</SelectItem>
                                        <SelectItem value="news">News</SelectItem>
                                        <SelectItem value="blog">Blog</SelectItem>
                                        <SelectItem value="alert">Alert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Visibility</label>
                                <Select 
                                    value={form.published ? "published" : "draft"} 
                                    onValueChange={(v) => setForm({ ...form, published: v === "published" })}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        <SelectItem value="published">Public (Published)</SelectItem>
                                        <SelectItem value="draft">Private (Draft)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                            <Input
                                placeholder="E.g., New Strategy Builder Released!"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="bg-slate-950 border-slate-800 focus:border-emerald-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Image URL</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://images.unsplash.com/..."
                                    value={form.coverImage}
                                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                                    className="bg-slate-950 border-slate-800"
                                />
                                {form.coverImage && (
                                    <div className="w-10 h-10 rounded border border-slate-800 overflow-hidden shrink-0">
                                        <img src={form.coverImage} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                Body Content
                                <span className="text-[10px] lowercase opacity-50 italic">Markdown supported</span>
                            </label>
                            <textarea
                                value={form.body}
                                onChange={(e) => setForm({ ...form, body: e.target.value })}
                                rows={10}
                                placeholder="Write your content here..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm focus:outline-none focus:border-emerald-500/50 min-h-[200px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Author Name</label>
                            <Input
                                value={form.author}
                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                    </div>
                    <DialogFooter className="border-t border-slate-800 pt-6">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[120px]">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Save Changes" : "Post Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
