"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout, AuthGuard } from "@/components/layout";
import { TradeTable } from "@/components/dashboard/TradeTable";
import { useTrades } from "@/hooks/useTrades";
import { useTradeStore } from "@/store/useTradeStore";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { AddTradeModal } from "@/components/dashboard/AddTradeModal";

export default function TradesPage() {
    const { trades, loading, deleteTrade } = useTrades();
    const { openAddModal, openEditModal } = useTradeStore();

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this trade?")) {
            await deleteTrade(id);
        }
    };

    return (
        <AuthGuard>
            <DashboardLayout>
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Trade Journal
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                View and manage your complete trading history
                            </p>
                        </div>
                        <Button onClick={openAddModal} className="shrink-0">
                            <Plus className="w-4 h-4 mr-2" />
                            Log New Trade
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
                    >
                        {loading ? (
                            <div className="p-12 flex justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <TradeTable
                                trades={trades}
                                loading={loading}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        )}
                    </motion.div>
                </div>
                <AddTradeModal />
            </DashboardLayout>
        </AuthGuard>
    );
}
