"use client";

import React, { useEffect, useState } from "react";
import {
    ScrollText,
    Search,
    CheckCircle2,
    XCircle,
    Shield,
    Database,
    Settings,
    Monitor,
    ChevronLeft,
    ChevronRight,
    Clock,
    Globe,
    Zap,
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    category: "auth" | "crud" | "settings" | "system";
    details: string;
    ip: string;
    userAgent: string;
    success: boolean;
    createdAt?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    auth: { icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10" },
    crud: { icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    settings: { icon: Settings, color: "text-purple-400", bg: "bg-purple-500/10" },
    system: { icon: Monitor, color: "text-amber-400", bg: "bg-amber-500/10" },
};

export default function LogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(0);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const perPage = 20;

    // Real-time Firestore listener for audit logs
    useEffect(() => {
        const q = query(
            collection(db, "superadmin_audit_logs"),
            orderBy("createdAt", "desc"),
            limit(300)
        );
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    const raw = doc.data();
                    return {
                        id: doc.id,
                        ...raw,
                        timestamp: raw.createdAt || raw.timestamp?.toDate?.()?.toISOString() || "",
                    } as AuditLog;
                });
                setLogs(data);
                setLastUpdate(new Date());
                setLoading(false);
            },
            (error) => {
                console.error("Real-time logs listener error:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const filtered = logs.filter((log) => {
        const matchesSearch =
            log.action?.toLowerCase().includes(search.toLowerCase()) ||
            log.details?.toLowerCase().includes(search.toLowerCase()) ||
            log.ip?.includes(search);
        const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || (statusFilter === "success" ? log.success : !log.success);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ScrollText className="w-6 h-6 text-rose-400" />
                        Audit Logs
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                        {logs.length} total entries
                        <span className="text-slate-600">•</span>
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-medium">Live</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs">Updated {lastUpdate.toLocaleTimeString()}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                        Real-time
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        placeholder="Search actions, details, or IP..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
                >
                    <option value="all">All Categories</option>
                    <option value="auth">Auth</option>
                    <option value="crud">CRUD</option>
                    <option value="settings">Settings</option>
                    <option value="system">System</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
                >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Logs Table */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800/50">
                                <th className="text-left text-slate-400 font-medium py-3 px-4">Status</th>
                                <th className="text-left text-slate-400 font-medium py-3 px-4">Action</th>
                                <th className="text-left text-slate-400 font-medium py-3 px-4 hidden md:table-cell">Category</th>
                                <th className="text-left text-slate-400 font-medium py-3 px-4 hidden lg:table-cell">Details</th>
                                <th className="text-left text-slate-400 font-medium py-3 px-4 hidden sm:table-cell">IP</th>
                                <th className="text-left text-slate-400 font-medium py-3 px-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-800/30">
                                        <td colSpan={6} className="py-3 px-4">
                                            <div className="h-6 bg-slate-800/50 rounded-lg animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        No logs found
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((log) => {
                                    const catConfig = CATEGORY_CONFIG[log.category] || CATEGORY_CONFIG.system;
                                    const CatIcon = catConfig.icon;
                                    return (
                                        <tr key={log.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                                            <td className="py-3 px-4">
                                                {log.success ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-400" />
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-white font-medium text-xs font-mono bg-slate-800/50 px-2 py-1 rounded-lg">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-md ${catConfig.bg} flex items-center justify-center`}>
                                                        <CatIcon className={`w-3 h-3 ${catConfig.color}`} />
                                                    </div>
                                                    <span className="text-xs text-slate-400 capitalize">{log.category}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 hidden lg:table-cell">
                                                <p className="text-xs text-slate-400 truncate max-w-[250px]" title={log.details}>
                                                    {log.details}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4 hidden sm:table-cell">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Globe className="w-3 h-3" />
                                                    {log.ip}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <Clock className="w-3 h-3" />
                                                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
                        <p className="text-xs text-slate-400">
                            {page * perPage + 1}-{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all disabled:opacity-30">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-slate-400 px-2">{page + 1} / {totalPages}</span>
                            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all disabled:opacity-30">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
