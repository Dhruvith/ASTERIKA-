"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, TrendingUp, AlertCircle } from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, signInWithGoogle, loading: authLoading, error: authError, isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            if (!email || !password) {
                throw new Error("Please enter both email and password");
            }
            await signIn(email, password);
        } catch (err: any) {
            console.error("Login failed:", err);
            if (err.code === 'auth/invalid-credential') {
                setLocalError("Invalid email or password. Please try again.");
            } else if (err.code === 'auth/too-many-requests') {
                setLocalError("Too many failed attempts. Please try again later.");
            } else {
                setLocalError(err.message || "Failed to sign in. Please try again.");
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
            console.error("Google sign in failed:", err);
            if (err.code === 'auth/popup-closed-by-user') {
                return;
            }
            setLocalError("Failed to sign in with Google. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <TrendingUp className="w-6 h-6 text-primary-foreground" />
                        </div>
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Sign in to your trading journal
                    </p>
                </div>

                <Card className="p-8 border-border shadow-xl shadow-black/5 bg-card">
                    {(authError || localError) && (
                        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive font-medium">
                                {localError || authError}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            {/* Added wrapper to match signup page structure if needed, or just standard input */}
                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-muted-foreground">Password</label>
                                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    // icon prop doesn't support positioning elements inside the input wrapper easily in the current Input component if it expects a node. 
                                    // Actually looking at Input.tsx, it takes `icon` node. 
                                    // Use standard input with custom eye icon button positioning or use the Input component and adjust.
                                    // The Input component has `icon` on the left.
                                    icon={<Lock className="w-4 h-4" />}
                                    placeholder="••••••••"
                                    required
                                    className="pr-10" // Make space for the eye icon
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition-colors"
                                // Adjusted top calculation based on label + input height
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20"
                            disabled={isSubmitting || authLoading}
                        >
                            {isSubmitting || authLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-muted-foreground font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-11 font-medium hover:bg-muted"
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-semibold text-primary hover:underline hover:text-primary/90"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
