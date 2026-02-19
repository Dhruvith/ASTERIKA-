import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, decryptSession } from "@/lib/superadmin-config";
import { writeAuditLog } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    try {
        const authHeader = request.headers.get("authorization");
        const cookieToken = request.cookies.get("sa_session")?.value;
        const encryptedToken = authHeader?.replace("Bearer ", "") || cookieToken;

        if (!encryptedToken) {
            return NextResponse.json({ valid: false, error: "No token" }, { status: 401 });
        }

        // Decrypt AES-256 session
        const token = decryptSession(encryptedToken);
        if (!token) {
            return NextResponse.json({ valid: false, error: "Invalid session" }, { status: 401 });
        }

        // Verify JWT
        const payload = verifyJWT(token);
        if (!payload || payload.role !== "superadmin") {
            await writeAuditLog({
                action: "SESSION_VERIFY_FAILED",
                category: "auth",
                details: "Invalid or expired JWT token",
                ip,
                userAgent,
                success: false,
            });
            return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
        }

        return NextResponse.json({
            valid: true,
            user: {
                username: "superadmin",
                role: "superadmin",
                exp: payload.exp,
            },
        });
    } catch (error) {
        console.error("[SUPERADMIN VERIFY] Error:", error);
        return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 401 });
    }
}
