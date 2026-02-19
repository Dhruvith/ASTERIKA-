import { NextRequest, NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    await writeAuditLog({
        action: "LOGOUT",
        category: "auth",
        details: "SuperAdmin logged out",
        ip,
        userAgent,
        success: true,
    });

    const response = NextResponse.json({ success: true });

    // Clear the session cookie
    response.cookies.set("sa_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    });

    return response;
}
