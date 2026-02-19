"use client";

import React, { useState, useEffect } from "react";
import {
    Settings,
    Shield,
    Key,
    Bell,
    Globe,
    Lock,
    RefreshCw,
    Check,
    Copy,
    Eye,
    EyeOff,
    AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
    const [totpData, setTotpData] = useState<{ secret: string; qrCode: string } | null>(null);
    const [loadingTotp, setLoadingTotp] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [settings, setSettings] = useState({
        sessionTimeout: "2h",
        corsOrigins: "https://asterika-tx.web.app",
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        auditLogRetention: 90,
        httpsOnly: true,
        rateLimitEnabled: true,
    });

    const handleSetupTOTP = async () => {
        setLoadingTotp(true);
        try {
            const token = sessionStorage.getItem("sa_token");
            const res = await fetch("/api/superadmin/totp-setup", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTotpData(data);
        } catch (err) {
            console.error("TOTP setup failed:", err);
        } finally {
            setLoadingTotp(false);
        }
    };

    const copySecret = () => {
        if (totpData?.secret) {
            navigator.clipboard.writeText(totpData.secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Settings className="w-6 h-6 text-purple-400" />
                    Security Settings
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Configure security parameters for the SuperAdmin portal
                </p>
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Encryption", value: "AES-256", icon: Lock, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Auth Method", value: "JWT + TOTP", icon: Key, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Rate Limit", value: "5 / 15min", icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${item.color}`} />
                                </div>
                                <span className="text-xs text-slate-400">{item.label}</span>
                            </div>
                            <p className="text-lg font-bold text-white">{item.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* 2FA Setup */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-400" />
                    Two-Factor Authentication (TOTP)
                </h3>

                {!totpData ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400">
                            Set up 2FA using Google Authenticator, Authy, or any TOTP-compatible app.
                        </p>
                        <button
                            onClick={handleSetupTOTP}
                            disabled={loadingTotp}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
                        >
                            {loadingTotp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                            Generate QR Code
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* QR Code */}
                            <div className="rounded-xl bg-white p-4 shrink-0">
                                <img src={totpData.qrCode} alt="TOTP QR Code" width={200} height={200} className="w-[200px] h-[200px]" />
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <p className="text-xs text-slate-400 mb-2">
                                        1. Scan this QR code with your authenticator app
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        2. Or manually enter this secret key:
                                    </p>
                                </div>

                                {/* Secret Key */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 font-mono text-sm text-white">
                                        {showSecret ? totpData.secret : "••••••••••••••••••••••••"}
                                    </div>
                                    <button onClick={() => setShowSecret(!showSecret)} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-all">
                                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={copySecret} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-all">
                                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-300">
                                        Save this secret key securely. You&apos;ll need it if you lose access to your authenticator app.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Configuration */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    Security Configuration
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase">Session Timeout</label>
                            <select value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all">
                                <option value="30m">30 minutes</option>
                                <option value="1h">1 hour</option>
                                <option value="2h">2 hours</option>
                                <option value="4h">4 hours</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase">Max Login Attempts</label>
                            <input type="number" value={settings.maxLoginAttempts} onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })} min={3} max={10} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase">Lockout Duration (min)</label>
                            <input type="number" value={settings.lockoutDuration} onChange={(e) => setSettings({ ...settings, lockoutDuration: parseInt(e.target.value) })} min={5} max={60} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase">Audit Log Retention (days)</label>
                            <input type="number" value={settings.auditLogRetention} onChange={(e) => setSettings({ ...settings, auditLogRetention: parseInt(e.target.value) })} min={30} max={365} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        {[
                            { label: "HTTPS Only", key: "httpsOnly" as const, desc: "Enforce HTTPS for all connections" },
                            { label: "Rate Limiting", key: "rateLimitEnabled" as const, desc: "Enable login rate limiting" },
                        ].map((toggle) => (
                            <div key={toggle.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                                <div>
                                    <p className="text-sm font-medium text-white">{toggle.label}</p>
                                    <p className="text-xs text-slate-400">{toggle.desc}</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${settings[toggle.key] ? "bg-emerald-500" : "bg-slate-700"}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings[toggle.key] ? "left-[22px]" : "left-0.5"}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CORS Config */}
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    CORS Configuration
                </h3>
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase">Allowed Origins</label>
                    <textarea
                        value={settings.corsOrigins}
                        onChange={(e) => setSettings({ ...settings, corsOrigins: e.target.value })}
                        rows={3}
                        placeholder="https://yourdomain.com"
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">One origin per line. Use * for development only.</p>
                </div>
            </div>
        </div>
    );
}
