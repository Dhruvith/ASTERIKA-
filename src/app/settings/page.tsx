"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/useUIStore";
import { Card, Button, Input } from "@/components/ui";
import { User, Sun, Moon, LogOut, Shield, Database } from "lucide-react";

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useUIStore();

    return (
        <AuthGuard>
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Account Settings
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your profile and application preferences
                        </p>
                    </motion.div>

                    {/* Profile Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-6 space-y-6">
                            <div className="flex items-center gap-4 border-b border-border pb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Profile Information</h2>
                                    <p className="text-sm text-muted-foreground">Your personal account details</p>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Display Name</label>
                                    <Input
                                        value={user?.displayName || ""}
                                        readOnly
                                        className="bg-secondary/50"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input
                                        value={user?.email || ""}
                                        readOnly
                                        className="bg-secondary/50"
                                        disabled
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Preferences Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-6 space-y-6">
                            <div className="flex items-center gap-4 border-b border-border pb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Preferences</h2>
                                    <p className="text-sm text-muted-foreground">Customize your experience</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium">Appearance</label>
                                    <p className="text-sm text-muted-foreground">
                                        Switch between light and dark mode
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={toggleTheme}
                                    className="w-32 justify-between"
                                >
                                    {theme === "dark" ? (
                                        <>
                                            <Moon className="w-4 h-4 mr-2" /> Dark
                                        </>
                                    ) : (
                                        <>
                                            <Sun className="w-4 h-4 mr-2" /> Light
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Data Management Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="p-6 space-y-6">
                            <div className="flex items-center gap-4 border-b border-border pb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Database className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Data Management</h2>
                                    <p className="text-sm text-muted-foreground">Control your trading data</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium text-destructive">Sign Out</label>
                                    <p className="text-sm text-muted-foreground">
                                        Securely logout of your session
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={logout}
                                    className="w-32"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </DashboardLayout>
        </AuthGuard>
    );
}
