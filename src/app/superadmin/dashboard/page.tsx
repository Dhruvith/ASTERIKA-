"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart3,
    Users,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Zap,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserDoc {
    id: string;
    stats?: {
        totalTrades?: number;
        winRate?: number;
        totalPnL?: number;
        lastUpdated?: any;
    };
    createdAt?: any;
}

export default function AnalyticsDashboard() {
    const [users, setUsers] = useState<UserDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Real-time Firestore listener for users collection
    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const userData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as UserDoc[];
                setUsers(userData);
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

    // Compute analytics from live data
    const totalUsers = users.length;
    const activeToday = users.filter((u) => {
        const last = u.stats?.lastUpdated;
        if (!last) return false;
        const date = last.toDate ? last.toDate() : new Date(last);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }).length;
    const totalTrades = users.reduce((acc, u) => acc + (u.stats?.totalTrades || 0), 0);
    const avgWinRate =
        users.length > 0
            ? Math.round(
                (users.reduce((acc, u) => acc + (u.stats?.winRate || 0), 0) / users.length) * 100
            ) / 100
            : 0;
    const totalPnL = users.reduce((acc, u) => acc + (u.stats?.totalPnL || 0), 0);

    // Generate chart data from real user data
    const registrationByMonth = (() => {
        const months: Record<string, number> = {};
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleString("default", { month: "short" });
            months[key] = 0;
        }
        users.forEach((u) => {
            if (u.createdAt) {
                const date = typeof u.createdAt === "string" ? new Date(u.createdAt) : u.createdAt.toDate?.() || new Date(u.createdAt);
                const key = date.toLocaleString("default", { month: "short" });
                if (months[key] !== undefined) months[key]++;
            }
        });
        return Object.entries(months).map(([name, signups]) => ({ name, signups, cumulative: 0 }));
    })();

    // Cumulative calculation
    let cumulative = totalUsers - registrationByMonth.reduce((a, b) => a + b.signups, 0);
    registrationByMonth.forEach((m) => {
        cumulative += m.signups;
        m.cumulative = cumulative;
    });

    // Win rate distribution
    const winRateDistribution = (() => {
        const buckets = [
            { name: "0-25%", value: 0, color: "#ef4444" },
            { name: "25-50%", value: 0, color: "#f59e0b" },
            { name: "50-75%", value: 0, color: "#3b82f6" },
            { name: "75-100%", value: 0, color: "#10b981" },
        ];
        users.forEach((u) => {
            const wr = u.stats?.winRate || 0;
            if (wr < 25) buckets[0].value++;
            else if (wr < 50) buckets[1].value++;
            else if (wr < 75) buckets[2].value++;
            else buckets[3].value++;
        });
        return buckets.filter((b) => b.value > 0);
    })();

    const statCards = [
        {
            label: "Total Users",
            value: totalUsers,
            icon: Users,
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-400",
            change: `${activeToday} today`,
            up: true,
        },
        {
            label: "Active Today",
            value: activeToday,
            icon: Activity,
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-400",
            change: `${totalUsers > 0 ? Math.round((activeToday / totalUsers) * 100) : 0}%`,
            up: activeToday > 0,
        },
        {
            label: "Total Trades",
            value: totalTrades.toLocaleString(),
            icon: TrendingUp,
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-400",
            change: `${users.length > 0 ? Math.round(totalTrades / users.length) : 0} avg`,
            up: true,
        },
        {
            label: "Avg Win Rate",
            value: `${avgWinRate}%`,
            icon: BarChart3,
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-400",
            change: avgWinRate >= 50 ? "Profitable" : "Below 50%",
            up: avgWinRate >= 50,
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-slate-800/50" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-80 rounded-2xl bg-slate-800/50" />
                    <div className="h-80 rounded-2xl bg-slate-800/50" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                    <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Real-time</span>
                        <span className="text-slate-600">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        Last update: {lastUpdate.toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                        Live Data
                    </span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={i}
                            className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5 group hover:border-slate-700/50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${card.textColor}`} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-semibold ${card.up ? "text-emerald-400" : "text-red-400"}`}>
                                    {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {card.change}
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-white">{card.value}</p>
                                <p className="text-xs text-slate-400 mt-1">{card.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* User Growth Chart */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        User Growth (6 months)
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={registrationByMonth}>
                                <defs>
                                    <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="cumulGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        border: "1px solid #1e293b",
                                        borderRadius: "12px",
                                        fontSize: "12px",
                                    }}
                                    labelStyle={{ color: "#f8fafc" }}
                                />
                                <Area type="monotone" dataKey="signups" stroke="#3b82f6" fill="url(#signupGrad)" strokeWidth={2} name="New Signups" />
                                <Area type="monotone" dataKey="cumulative" stroke="#10b981" fill="url(#cumulGrad)" strokeWidth={2} name="Total Users" />
                                <Legend />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Win Rate Distribution */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        Win Rate Distribution
                    </h3>
                    <div className="h-64 flex items-center">
                        {winRateDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={winRateDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {winRateDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0f172a",
                                            border: "1px solid #1e293b",
                                            borderRadius: "12px",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: any) => [`${value} users`, ""]}
                                    />
                                    <Legend
                                        formatter={(value) => (
                                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full text-center text-slate-500 text-sm">
                                No user data available yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Total P&L</p>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        ${totalPnL.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Across all users</p>
                </div>
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Avg Trades/User</p>
                    <p className="text-2xl font-bold text-white">
                        {users.length > 0 ? Math.round(totalTrades / users.length) : 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Trades per user</p>
                </div>
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Data Source</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <p className="text-lg font-bold text-emerald-400">Firestore Live</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Real-time listeners active</p>
                </div>
            </div>
        </div>
    );
}
