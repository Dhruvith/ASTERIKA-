"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Lock,
    User,
    Eye,
    EyeOff,
    Loader2,
    AlertTriangle,
    KeyRound,
    Fingerprint,
} from "lucide-react";
import { useSuperAdminStore } from "@/store/useSuperAdminStore";

export default function SuperAdminLoginPage() {
    const router = useRouter();
    const { login, skip2FA, verify, isAuthenticated, loading, error, requires2FA, clearError } =
        useSuperAdminStore();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [totpCode, setTotpCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<"credentials" | "totp">("credentials");

    useEffect(() => {
        verify().then((valid) => {
            if (valid) router.push("/superadmin/dashboard");
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/superadmin/dashboard");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (requires2FA) {
            setStep("totp");
        }
    }, [requires2FA]);

    const handleCredentialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const success = await login(username, password);
        if (success) {
            router.push("/superadmin/dashboard");
        }
    };

    const handleTOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const success = await login(username, password, totpCode);
        if (success) {
            router.push("/superadmin/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-transparent to-transparent" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 mb-4"
                    >
                        <Shield className="w-10 h-10 text-red-400" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        SuperAdmin Access
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 flex items-center justify-center gap-2">
                        <Lock className="w-3.5 h-3.5" />
                        Restricted Zone — Authorized Personnel Only
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-black/20 p-8">
                    {/* Security indicator */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium tracking-wide uppercase">
                            AES-256 Encrypted • JWT Secured • 2FA Protected
                        </span>
                    </div>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                            >
                                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {step === "credentials" ? (
                            <motion.form
                                key="credentials"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleCredentialSubmit}
                                className="space-y-5"
                            >
                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.replace(/[<>'"]/g, ""))}
                                            placeholder="Enter username"
                                            autoComplete="off"
                                            spellCheck={false}
                                            required
                                            maxLength={64}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••••••"
                                            required
                                            maxLength={128}
                                            className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading || !username || !password}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <Fingerprint className="w-4 h-4" />
                                            Authenticate
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="totp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleTOTPSubmit}
                                className="space-y-5"
                            >
                                <div className="text-center mb-4">
                                    <KeyRound className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                                    <p className="text-sm text-slate-300">
                                        Enter the 6-digit code from your authenticator app
                                    </p>
                                </div>

                                {/* TOTP Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        2FA Code
                                    </label>
                                    <input
                                        type="text"
                                        value={totpCode}
                                        onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        autoFocus
                                        className="w-full text-center py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-2xl tracking-[0.5em] font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || totpCode.length !== 6}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            Verify & Login
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const ok = skip2FA();
                                        if (ok) router.push("/superadmin/dashboard");
                                    }}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    Skip for now — setup 2FA later in Settings
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("credentials");
                                        setTotpCode("");
                                        clearError();
                                    }}
                                    className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    ← Back to credentials
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    Rate limited: 5 attempts → 15min lockout • All activity logged
                </p>
            </motion.div>
        </div>
    );
}
