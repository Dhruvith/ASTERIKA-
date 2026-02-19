"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
    BarChart3,
    Users,
    TrendingUp,
    Activity,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    MapPin,
    Clock,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Legend,
} from "recharts";

interface AnalyticsData {
    totalUsers: number;
    activeToday: number;
    totalTrades: number;
    avgWinRate: number;
    trafficData: { name: string; visits: number; unique: number }[];
    usageData: { name: string; value: number; color: string }[];
}

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchAnalytics = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("sa_token");
            const res = await fetch("/api/superadmin/data?entity=analytics", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (json.data && json.data.length > 0) {
                setData(json.data[0]);
            }
            setLastRefresh(new Date());
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAnalytics();
    };

    const statCards = data
        ? [
            {
                label: "Total Users",
                value: data.totalUsers,
                icon: Users,
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-500/10",
                textColor: "text-blue-400",
                change: "+12%",
                up: true,
            },
            {
                label: "Active Today",
                value: data.activeToday,
                icon: Activity,
                color: "from-emerald-500 to-green-500",
                bgColor: "bg-emerald-500/10",
                textColor: "text-emerald-400",
                change: "+5%",
                up: true,
            },
            {
                label: "Total Trades",
                value: data.totalTrades.toLocaleString(),
                icon: TrendingUp,
                color: "from-amber-500 to-orange-500",
                bgColor: "bg-amber-500/10",
                textColor: "text-amber-400",
                change: "+28%",
                up: true,
            },
            {
                label: "Avg Win Rate",
                value: `${data.avgWinRate}%`,
                icon: BarChart3,
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-500/10",
                textColor: "text-purple-400",
                change: "-2%",
                up: false,
            },
        ]
        : [];

    // Heatmap data for geofences
    const heatmapData = [
        { zone: "Zone A", Mon: 12, Tue: 19, Wed: 3, Thu: 5, Fri: 2, Sat: 15, Sun: 8 },
        { zone: "Zone B", Mon: 8, Tue: 14, Wed: 22, Thu: 11, Fri: 7, Sat: 3, Sun: 19 },
        { zone: "Zone C", Mon: 5, Tue: 8, Wed: 15, Thu: 22, Fri: 18, Sat: 10, Sun: 4 },
        { zone: "Zone D", Mon: 18, Tue: 3, Wed: 8, Thu: 14, Fri: 22, Sat: 7, Sun: 12 },
        { zone: "Zone E", Mon: 3, Tue: 22, Wed: 11, Thu: 8, Fri: 15, Sat: 19, Sun: 5 },
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
                        <Clock className="w-3.5 h-3.5" />
                        Last updated: {lastRefresh.toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm font-medium transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                </button>
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
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rounded-full -translate-y-8 translate-x-8" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
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
                {/* Traffic Chart */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        Weekly Traffic
                    </h3>
                    <div className="h-64">
                        {data?.trafficData && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.trafficData}>
                                    <defs>
                                        <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="uniqueGrad" x1="0" y1="0" x2="0" y2="1">
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
                                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="url(#visitGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="unique" stroke="#10b981" fill="url(#uniqueGrad)" strokeWidth={2} />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Usage Pie Chart */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        Feature Usage
                    </h3>
                    <div className="h-64 flex items-center">
                        {data?.usageData && (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.usageData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {data.usageData.map((entry, index) => (
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
                                    />
                                    <Legend
                                        formatter={(value) => (
                                            <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* Geofence Heatmap */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Geofence Activity Heatmap
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left text-slate-400 font-medium py-2 px-3">Zone</th>
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                    <th key={day} className="text-center text-slate-400 font-medium py-2 px-3">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {heatmapData.map((row) => (
                                <tr key={row.zone}>
                                    <td className="text-white font-medium py-2 px-3">{row.zone}</td>
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                                        const val = row[day as keyof typeof row] as number;
                                        const intensity = Math.min(val / 22, 1);
                                        return (
                                            <td key={day} className="py-2 px-3">
                                                <div
                                                    className="w-full h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all"
                                                    style={{
                                                        backgroundColor: `rgba(245, 158, 11, ${intensity * 0.6})`,
                                                        color: intensity > 0.5 ? "#ffffff" : "#94a3b8",
                                                    }}
                                                >
                                                    {val}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
