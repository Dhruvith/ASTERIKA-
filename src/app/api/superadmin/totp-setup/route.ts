import { NextRequest, NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";
import { getTOTPSecret, verifyJWT, decryptSession } from "@/lib/superadmin-config";

// Verify superadmin session before exposing TOTP secret
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

export async function GET(request: NextRequest) {
    // SECURITY: Require authentication before exposing TOTP secret
    if (!(await verifySuperAdmin(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const secret = getTOTPSecret();
        const otpauthUrl = generateURI({
            issuer: "Asterika-Admin",
            label: "superadmin",
            secret,
            algorithm: "sha1",
            digits: 6,
            period: 30,
        });
        const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

        return NextResponse.json({
            secret,
            otpauthUrl,
            qrCode: qrCodeDataUrl,
        });
    } catch (error) {
        console.error("[TOTP SETUP] Error:", error);
        return NextResponse.json({ error: "Failed to generate TOTP" }, { status: 500 });
    }
}
