// Audit Log System - Records every superadmin action
import { doc, setDoc, collection, getDocs, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    category: "auth" | "crud" | "settings" | "system";
    details: string;
    ip: string;
    userAgent: string;
    success: boolean;
}

// Server-side audit log (writes to Firestore)
export async function writeAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
    try {
        const logRef = doc(collection(db, "superadmin_audit_logs"));
        await setDoc(logRef, {
            ...entry,
            id: logRef.id,
            timestamp: Timestamp.now(),
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[AUDIT] Failed to write log:", error);
    }
}

// Client-side: fetch audit logs
export async function fetchAuditLogs(maxCount: number = 100): Promise<AuditLogEntry[]> {
    try {
        const logsRef = collection(db, "superadmin_audit_logs");
        const q = query(logsRef, orderBy("timestamp", "desc"), limit(maxCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                timestamp: data.createdAt || data.timestamp?.toDate?.()?.toISOString() || "",
                action: data.action || "",
                category: data.category || "system",
                details: data.details || "",
                ip: data.ip || "",
                userAgent: data.userAgent || "",
                success: data.success ?? true,
            };
        });
    } catch (error) {
        console.error("[AUDIT] Failed to fetch logs:", error);
        return [];
    }
}
