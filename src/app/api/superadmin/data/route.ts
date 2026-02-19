import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyJWT, decryptSession } from "@/lib/superadmin-config";
import { writeAuditLog } from "@/lib/audit-log";

// Middleware: verify superadmin token
async function verifySuperAdmin(request: NextRequest): Promise<boolean> {
    const cookieToken = request.cookies.get("sa_session")?.value;
    const authHeader = request.headers.get("authorization");
    const encryptedToken = authHeader?.replace("Bearer ", "") || cookieToken;

    if (!encryptedToken) return false;

    try {
        const token = decryptSession(encryptedToken);
        const payload = verifyJWT(token);
        return payload?.role === "superadmin";
    } catch {
        return false;
    }
}

function sanitize(input: string): string {
    return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/on\w+=/gi, "").trim();
}

// GET: Fetch dashboard data (users, analytics, geofences, logs)
export async function GET(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    if (!(await verifySuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entity = sanitize(searchParams.get("entity") || "");
    const limitCount = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

    try {
        let data: any[] = [];

        switch (entity) {
            case "users": {
                const usersRef = collection(db, "users");
                const q = query(usersRef, limit(limitCount));
                const snapshot = await getDocs(q);
                data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                break;
            }
            case "geofences": {
                const geoRef = collection(db, "geofences");
                const q = query(geoRef, limit(limitCount));
                const snapshot = await getDocs(q);
                data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                break;
            }
            case "audit_logs": {
                const logsRef = collection(db, "superadmin_audit_logs");
                const q = query(logsRef, orderBy("timestamp", "desc"), limit(limitCount));
                const snapshot = await getDocs(q);
                data = snapshot.docs.map((d) => {
                    const raw = d.data();
                    return {
                        id: d.id,
                        ...raw,
                        timestamp: raw.createdAt || raw.timestamp?.toDate?.()?.toISOString() || "",
                    };
                });
                break;
            }
            case "analytics": {
                // Aggregate analytics from users collection
                const usersRef = collection(db, "users");
                const snapshot = await getDocs(usersRef);
                const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                const totalUsers = users.length;
                const activeToday = users.filter((u: any) => {
                    const last = u.stats?.lastUpdated;
                    if (!last) return false;
                    const date = last.toDate ? last.toDate() : new Date(last);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                }).length;
                const totalTrades = users.reduce((acc: number, u: any) => acc + (u.stats?.totalTrades || 0), 0);
                const avgWinRate = users.length > 0
                    ? users.reduce((acc: number, u: any) => acc + (u.stats?.winRate || 0), 0) / users.length
                    : 0;

                data = [{
                    totalUsers,
                    activeToday,
                    totalTrades,
                    avgWinRate: Math.round(avgWinRate * 100) / 100,
                    trafficData: generateTrafficData(),
                    usageData: generateUsageData(),
                }];
                break;
            }
            default:
                return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
        }

        await writeAuditLog({
            action: `READ_${entity.toUpperCase()}`,
            category: "crud",
            details: `Fetched ${data.length} ${entity} records`,
            ip,
            userAgent,
            success: true,
        });

        return NextResponse.json({ data, count: data.length });
    } catch (error) {
        console.error(`[SUPERADMIN DATA] Error fetching ${entity}:`, error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// POST: Create entity
export async function POST(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    if (!(await verifySuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const entity = sanitize(body.entity || "");
        const data = body.data || {};

        const collectionName = entity === "geofences" ? "geofences" : entity;
        const docRef = doc(collection(db, collectionName));

        await setDoc(docRef, {
            ...data,
            id: docRef.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        await writeAuditLog({
            action: `CREATE_${entity.toUpperCase()}`,
            category: "crud",
            details: `Created ${entity} with ID: ${docRef.id}`,
            ip,
            userAgent,
            success: true,
        });

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
        console.error("[SUPERADMIN DATA] Create error:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}

// PUT: Update entity
export async function PUT(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    if (!(await verifySuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const entity = sanitize(body.entity || "");
        const id = sanitize(body.id || "");
        const data = body.data || {};

        const docRef = doc(db, entity, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });

        await writeAuditLog({
            action: `UPDATE_${entity.toUpperCase()}`,
            category: "crud",
            details: `Updated ${entity} with ID: ${id}`,
            ip,
            userAgent,
            success: true,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[SUPERADMIN DATA] Update error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

// DELETE: Delete entity
export async function DELETE(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    if (!(await verifySuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const entity = sanitize(searchParams.get("entity") || "");
        const id = sanitize(searchParams.get("id") || "");

        if (!entity || !id) {
            return NextResponse.json({ error: "Entity and ID required" }, { status: 400 });
        }

        await deleteDoc(doc(db, entity, id));

        await writeAuditLog({
            action: `DELETE_${entity.toUpperCase()}`,
            category: "crud",
            details: `Deleted ${entity} with ID: ${id}`,
            ip,
            userAgent,
            success: true,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[SUPERADMIN DATA] Delete error:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

// Helper functions for mock analytics data
function generateTrafficData() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
        name: day,
        visits: Math.floor(Math.random() * 500) + 100,
        unique: Math.floor(Math.random() * 300) + 50,
    }));
}

function generateUsageData() {
    return [
        { name: "Dashboard", value: 40, color: "#3b82f6" },
        { name: "Trades", value: 30, color: "#10b981" },
        { name: "Analytics", value: 20, color: "#f59e0b" },
        { name: "Journal", value: 10, color: "#8b5cf6" },
    ];
}
