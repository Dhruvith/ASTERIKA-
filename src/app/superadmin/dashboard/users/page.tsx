"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    Search,
    Trash2,
    Edit3,
    Eye,
    X,
    Check,
    AlertTriangle,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Zap,
} from "lucide-react";
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserRecord {
    id: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    createdAt?: string;
    preferences?: {
        theme?: string;
        defaultCurrency?: string;
        startingCapital?: number;
    };
    stats?: {
        totalTrades?: number;
        winRate?: number;
        totalPnL?: number;
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [page, setPage] = useState(0);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const perPage = 10;

    // Real-time Firestore listener
    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as UserRecord[];
                setUsers(data);
                setLastUpdate(new Date());
                setLoading(false);
            },
            (error) => {
                console.error("Real-time users listener error:", error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, "users", id));
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        try {
            const { id, ...data } = editingUser;
            await updateDoc(doc(db, "users", id), {
                ...data,
                updatedAt: new Date().toISOString(),
            });
            setEditingUser(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const filteredUsers = users.filter(
        (u) =>
            (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (u.displayName || "").toLowerCase().includes(search.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="w-6 h-6 text-emerald-400" />
                        User Management
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                        {users.length} total users
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

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(0);
                    }}
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                />
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800/50">
                                <th className="text-left text-slate-400 font-medium py-3 px-4">User</th>
                                <th className="text-left text-slate-400 font-medium py-3 px-4 hidden sm:table-cell">Email</th>
                                <th className="text-center text-slate-400 font-medium py-3 px-4 hidden md:table-cell">Trades</th>
                                <th className="text-center text-slate-400 font-medium py-3 px-4 hidden md:table-cell">Win Rate</th>
                                <th className="text-center text-slate-400 font-medium py-3 px-4 hidden lg:table-cell">P&L</th>
                                <th className="text-right text-slate-400 font-medium py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-800/30">
                                        <td colSpan={6} className="py-4 px-4">
                                            <div className="h-8 bg-slate-800/50 rounded-lg animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                                                    {(user.displayName || user.email || "?")[0].toUpperCase()}
                                                </div>
                                                <span className="text-white font-medium truncate max-w-[150px]">
                                                    {user.displayName || "—"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400 hidden sm:table-cell truncate max-w-[200px]">
                                            {user.email || "—"}
                                        </td>
                                        <td className="py-3 px-4 text-center text-slate-300 hidden md:table-cell">
                                            {user.stats?.totalTrades ?? 0}
                                        </td>
                                        <td className="py-3 px-4 text-center hidden md:table-cell">
                                            <span className={`font-medium ${(user.stats?.winRate ?? 0) >= 50 ? "text-emerald-400" : "text-red-400"}`}>
                                                {user.stats?.winRate ?? 0}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center hidden lg:table-cell">
                                            <span className={`font-medium ${(user.stats?.totalPnL ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                                ${(user.stats?.totalPnL ?? 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingUser({ ...user })}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(user.id)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800/50">
                        <p className="text-xs text-slate-400">
                            Showing {page * perPage + 1}-{Math.min((page + 1) * perPage, filteredUsers.length)} of {filteredUsers.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-slate-400 px-2">
                                {page + 1} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
                    <div className="w-full max-w-md rounded-2xl border border-slate-800/50 bg-slate-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">User Details</h3>
                            <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Email</p>
                                    <p className="text-white">{selectedUser.email || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                                <Users className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Display Name</p>
                                    <p className="text-white">{selectedUser.displayName || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Joined</p>
                                    <p className="text-white">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "—"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                                    <p className="text-lg font-bold text-white">{selectedUser.stats?.totalTrades ?? 0}</p>
                                    <p className="text-[10px] text-slate-500">Trades</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                                    <p className="text-lg font-bold text-emerald-400">{selectedUser.stats?.winRate ?? 0}%</p>
                                    <p className="text-[10px] text-slate-500">Win Rate</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/50 text-center">
                                    <p className={`text-lg font-bold ${(selectedUser.stats?.totalPnL ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        ${(selectedUser.stats?.totalPnL ?? 0).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-500">P&L</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
                    <div className="w-full max-w-md rounded-2xl border border-slate-800/50 bg-slate-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Edit User</h3>
                            <button onClick={() => setEditingUser(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Display Name</label>
                                <input
                                    type="text"
                                    value={editingUser.displayName || ""}
                                    onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ""}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-500 hover:to-cyan-500 transition-all"
                            >
                                <Check className="w-4 h-4" /> Save Changes
                            </button>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-slate-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Delete User</h3>
                                <p className="text-sm text-slate-400">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
