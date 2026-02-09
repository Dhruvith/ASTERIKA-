"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function SignupPage() {
    const router = useRouter();
    const { signUp, signInWithGoogle, loading: authLoading, error: authError, isAuthenticated } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLocalError("");

        try {
            if (!name || !email || !password || !confirmPassword) {
                throw new Error("Please fill in all fields");
            }
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }

            await signUp(email, password, name);
        } catch (err: any) {
            console.error("Signup failed:", err);
            if (err.code === 'auth/email-already-in-use') {
                setLocalError("This email is already registered. Redirecting to login...");
                setTimeout(() => router.push("/login"), 2000);
            } else if (err.code === 'auth/weak-password') {
                setLocalError("Password is too weak. Please use a stronger password.");
            } else {
                setLocalError(err.message || "Failed to create account. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLocalError("");
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error("Google sign up failed:", err);
            if (err.code === 'auth/popup-closed-by-user') return;
            setLocalError("Failed to sign up with Google. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[480px] relative z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105 active:scale-95">
                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <TrendingUp className="w-6 h-6 text-primary-foreground" />
                        </div>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-muted-foreground text-lg">
                        Start tracking your trades like a pro
                    </p>
                </div>

                <Card className="p-8 md:p-10 border-border shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-xl">
                    {(authError || localError) && (
                        <div className="mb-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-4 animate-in slide-in-from-top-2">
                            <div className="p-2 rounded-full bg-destructive/20 shrink-0">
                                <AlertCircle className="w-5 h-5 text-destructive" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-destructive">Authentication Error</h4>
                                <p className="text-sm text-destructive/90 mt-1 leading-relaxed">
                                    {localError || authError}
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6">
                            <Input
                                label="Full Name"
                                placeholder="e.g. Alex Trader"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<UserIcon className="w-4 h-4" />}
                                required
                            />

                            <Input
                                label="Email Address"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                                required
                            />

                            <div className="space-y-6">
                                <div className="relative">
                                    <Input
                                        label="Password"
                                        placeholder="Min. 6 characters"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={<Lock className="w-4 h-4" />}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                <Input
                                    label="Confirm Password"
                                    placeholder="Retype password"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    icon={<Lock className="w-4 h-4" />}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full text-base font-bold shadow-xl shadow-primary/20 mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={isSubmitting || authLoading}
                        >
                            {isSubmitting || authLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm uppercase tracking-wider">
                            <span className="px-4 bg-card text-muted-foreground font-semibold text-xs">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full font-semibold border-border hover:bg-muted transition-all group"
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                    >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </Button>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-bold text-primary hover:text-primary/90 hover:underline transition-all"
                        >
                            Sign in
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
