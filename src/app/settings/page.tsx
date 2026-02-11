"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/useUIStore";
import { useAccounts } from "@/hooks/useAccounts";
import {
    Card,
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { User, Sun, Moon, LogOut, Shield, Database, Globe, DollarSign, Clock } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const currencies = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "INR", label: "INR - Indian Rupee" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "CHF", label: "CHF - Swiss Franc" },
    { value: "SGD", label: "SGD - Singapore Dollar" },
    { value: "HKD", label: "HKD - Hong Kong Dollar" },
];

const timezones = [
    { value: "America/New_York", label: "EST - New York" },
    { value: "America/Chicago", label: "CST - Chicago" },
    { value: "America/Los_Angeles", label: "PST - Los Angeles" },
    { value: "Europe/London", label: "GMT - London" },
    { value: "Europe/Paris", label: "CET - Paris" },
    { value: "Asia/Kolkata", label: "IST - Mumbai" },
    { value: "Asia/Tokyo", label: "JST - Tokyo" },
    { value: "Asia/Shanghai", label: "CST - Shanghai" },
    { value: "Asia/Singapore", label: "SGT - Singapore" },
    { value: "Australia/Sydney", label: "AEST - Sydney" },
    { value: "Pacific/Auckland", label: "NZST - Auckland" },
    { value: "Asia/Dubai", label: "GST - Dubai" },
    { value: "Asia/Hong_Kong", label: "HKT - Hong Kong" },
];

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useUIStore();
    const { defaultAccount } = useAccounts();

    const [currency, setCurrency] = useState(user?.preferences?.defaultCurrency || "USD");
    const [timezone, setTimezone] = useState(user?.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSavePreferences = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                "preferences.defaultCurrency": currency,
                "preferences.timezone": timezone,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save preferences:", error);
        } finally {
            setSaving(false);
        }
    };

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
                            Manage your profile, preferences, and application settings
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

                    {/* Appearance */}
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

                    {/* Currency & Timezone */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                    >
                        <Card className="p-6 space-y-6">
                            <div className="flex items-center gap-4 border-b border-border pb-6">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Currency & Time Zone</h2>
                                    <p className="text-sm text-muted-foreground">Set your default currency and time zone for accurate reporting</p>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-primary" />
                                        Default Currency
                                    </label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((c) => (
                                                <SelectItem key={c.value} value={c.value}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        Time Zone
                                    </label>
                                    <Select value={timezone} onValueChange={setTimezone}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezones.map((tz) => (
                                                <SelectItem key={tz.value} value={tz.value}>
                                                    {tz.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button onClick={handleSavePreferences} disabled={saving}>
                                    {saving ? (
                                        <>Saving...</>
                                    ) : saved ? (
                                        <>✓ Saved!</>
                                    ) : (
                                        <>Save Preferences</>
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
