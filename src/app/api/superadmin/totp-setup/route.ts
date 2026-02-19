import { NextRequest, NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";
import { getTOTPSecret } from "@/lib/superadmin-config";

export async function GET(request: NextRequest) {
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
