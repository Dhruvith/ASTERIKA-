"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    MapPin,
    Plus,
    Search,
    RefreshCw,
    Trash2,
    Edit3,
    X,
    Check,
    AlertTriangle,
    Globe,
    Radius,
} from "lucide-react";

interface Geofence {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    type: string;
    status: "active" | "inactive";
    createdAt?: string;
}

export default function GeofencesPage() {
    const [geofences, setGeofences] = useState<Geofence[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editingFence, setEditingFence] = useState<Geofence | null>(null);
    const [showDelete, setShowDelete] = useState<string | null>(null);
    const [newFence, setNewFence] = useState({ name: "", latitude: 0, longitude: 0, radius: 500, type: "circular", status: "active" as const });

    const fetchGeofences = useCallback(async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("sa_token");
            const res = await fetch("/api/superadmin/data?entity=geofences&limit=100", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            setGeofences(json.data || []);
        } catch (err) {
            console.error("Failed to fetch geofences:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchGeofences(); }, [fetchGeofences]);

    const handleCreate = async () => {
        try {
            const token = sessionStorage.getItem("sa_token");
            const res = await fetch("/api/superadmin/data", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ entity: "geofences", data: newFence }),
            });
            const json = await res.json();
            if (json.success) {
                fetchGeofences();
                setShowCreate(false);
                setNewFence({ name: "", latitude: 0, longitude: 0, radius: 500, type: "circular", status: "active" });
            }
        } catch (err) {
            console.error("Create failed:", err);
        }
    };

    const handleUpdate = async () => {
        if (!editingFence) return;
        try {
            const token = sessionStorage.getItem("sa_token");
            await fetch("/api/superadmin/data", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ entity: "geofences", id: editingFence.id, data: editingFence }),
            });
            setGeofences(geofences.map((g) => (g.id === editingFence.id ? editingFence : g)));
            setEditingFence(null);
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = sessionStorage.getItem("sa_token");
            await fetch(`/api/superadmin/data?entity=geofences&id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setGeofences(geofences.filter((g) => g.id !== id));
            setShowDelete(null);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const filtered = geofences.filter((g) => g.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-amber-400" />
                        Geofence Management
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">{geofences.length} geofences configured</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchGeofences} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm font-medium transition-all">
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold hover:from-amber-500 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/20">
                        <Plus className="w-4 h-4" /> Add Geofence
                    </button>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search geofences..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-48 rounded-2xl bg-slate-800/50 animate-pulse" />
                    ))
                    : filtered.map((fence) => (
                        <div key={fence.id} className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5 hover:border-slate-700/50 transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">{fence.name || "Unnamed"}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase">{fence.type || "circular"}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${fence.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/50 text-slate-400"}`}>
                                    {fence.status || "active"}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>{fence.latitude?.toFixed(4)}, {fence.longitude?.toFixed(4)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Radius className="w-3.5 h-3.5" />
                                    <span>{fence.radius}m radius</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingFence({ ...fence })} className="flex-1 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-all flex items-center justify-center gap-1">
                                    <Edit3 className="w-3 h-3" /> Edit
                                </button>
                                <button onClick={() => setShowDelete(fence.id)} className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-1">
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
                    <div className="w-full max-w-md rounded-2xl border border-slate-800/50 bg-slate-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Create Geofence</h3>
                            <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs font-semibold text-slate-400 uppercase">Name</label><input type="text" value={newFence.name} onChange={(e) => setNewFence({ ...newFence, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-semibold text-slate-400 uppercase">Latitude</label><input type="number" step="0.0001" value={newFence.latitude} onChange={(e) => setNewFence({ ...newFence, latitude: parseFloat(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all" /></div>
                                <div><label className="text-xs font-semibold text-slate-400 uppercase">Longitude</label><input type="number" step="0.0001" value={newFence.longitude} onChange={(e) => setNewFence({ ...newFence, longitude: parseFloat(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all" /></div>
                            </div>
                            <div><label className="text-xs font-semibold text-slate-400 uppercase">Radius (m)</label><input type="number" value={newFence.radius} onChange={(e) => setNewFence({ ...newFence, radius: parseInt(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all" /></div>
                        </div>
                        <button onClick={handleCreate} disabled={!newFence.name} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50">
                            <Plus className="w-4 h-4" /> Create Geofence
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingFence && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditingFence(null)}>
                    <div className="w-full max-w-md rounded-2xl border border-slate-800/50 bg-slate-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Edit Geofence</h3>
                            <button onClick={() => setEditingFence(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs font-semibold text-slate-400 uppercase">Name</label><input type="text" value={editingFence.name} onChange={(e) => setEditingFence({ ...editingFence, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-semibold text-slate-400 uppercase">Latitude</label><input type="number" step="0.0001" value={editingFence.latitude} onChange={(e) => setEditingFence({ ...editingFence, latitude: parseFloat(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" /></div>
                                <div><label className="text-xs font-semibold text-slate-400 uppercase">Longitude</label><input type="number" step="0.0001" value={editingFence.longitude} onChange={(e) => setEditingFence({ ...editingFence, longitude: parseFloat(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" /></div>
                            </div>
                            <div><label className="text-xs font-semibold text-slate-400 uppercase">Radius (m)</label><input type="number" value={editingFence.radius} onChange={(e) => setEditingFence({ ...editingFence, radius: parseInt(e.target.value) })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" /></div>
                            <div><label className="text-xs font-semibold text-slate-400 uppercase">Status</label>
                                <select value={editingFence.status} onChange={(e) => setEditingFence({ ...editingFence, status: e.target.value as "active" | "inactive" })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleUpdate} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-500 hover:to-cyan-500 transition-all"><Check className="w-4 h-4" /> Save</button>
                            <button onClick={() => setEditingFence(null)} className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm hover:text-white transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {showDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDelete(null)}>
                    <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-slate-900 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
                            <div><h3 className="text-lg font-bold text-white">Delete Geofence</h3><p className="text-sm text-slate-400">This action cannot be undone.</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => handleDelete(showDelete)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all">Delete</button>
                            <button onClick={() => setShowDelete(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm hover:text-white transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
