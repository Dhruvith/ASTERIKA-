import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { verifySync } from "otplib";
import {
    generateJWT,
    encryptSession,
    checkRateLimit,
    recordLoginAttempt,
    getTOTPSecret,
} from "@/lib/superadmin-config";
import { writeAuditLog } from "@/lib/audit-log";

// Sanitize input against XSS / injection
function sanitize(input: string): string {
    return input
        .replace(/[<>]/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "")
        .trim()
        .slice(0, 128);
}

export async function POST(request: NextRequest) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    try {
        // Rate limit check
        const rateCheck = checkRateLimit(ip);
        if (!rateCheck.allowed) {
            await writeAuditLog({
                action: "LOGIN_BLOCKED_RATE_LIMIT",
                category: "auth",
                details: `IP: ${ip} blocked due to rate limiting. Locked until: ${new Date(rateCheck.lockedUntil!).toISOString()}`,
                ip,
                userAgent,
                success: false,
            });

            return NextResponse.json(
                {
                    error: "Too many login attempts. Account locked for 15 minutes.",
                    lockedUntil: rateCheck.lockedUntil,
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const username = sanitize(body.username || "");
        const password = sanitize(body.password || "");
        const totpCode = sanitize(body.totpCode || "");

        // Step 1: Validate username
        if (username !== "superadmin") {
            recordLoginAttempt(ip, false);
            await writeAuditLog({
                action: "LOGIN_FAILED_INVALID_USERNAME",
                category: "auth",
                details: `Invalid username attempt: ${username.slice(0, 20)}`,
                ip,
                userAgent,
                success: false,
            });
            return NextResponse.json(
                { error: "Invalid credentials", remainingAttempts: rateCheck.remainingAttempts - 1 },
                { status: 401 }
            );
        }

        // Step 2: Verify password
        const storedHash = await bcryptjs.hash("A$t3r!k@Sup3r#9X", 12);
        const passwordValid = await bcryptjs.compare(password, storedHash);

        if (!passwordValid) {
            recordLoginAttempt(ip, false);
            await writeAuditLog({
                action: "LOGIN_FAILED_INVALID_PASSWORD",
                category: "auth",
                details: "Invalid password attempt",
                ip,
                userAgent,
                success: false,
            });
            return NextResponse.json(
                { error: "Invalid credentials", remainingAttempts: rateCheck.remainingAttempts - 1 },
                { status: 401 }
            );
        }

        // Step 3: TOTP verification (2FA)
        if (totpCode) {
            const totpSecret = getTOTPSecret();
            const isValid = verifySync({ token: totpCode, secret: totpSecret });

            if (!isValid) {
                recordLoginAttempt(ip, false);
                await writeAuditLog({
                    action: "LOGIN_FAILED_INVALID_TOTP",
                    category: "auth",
                    details: "Invalid TOTP code",
                    ip,
                    userAgent,
                    success: false,
                });
                return NextResponse.json(
                    { error: "Invalid 2FA code", remainingAttempts: rateCheck.remainingAttempts - 1 },
                    { status: 401 }
                );
            }
        }

        // Step 4: Generate JWT + encrypted session
        const jwtPayload = {
            sub: "superadmin",
            role: "superadmin",
            iat: Math.floor(Date.now() / 1000),
        };

        const token = generateJWT(jwtPayload);
        const encryptedToken = encryptSession(token);

        // Record success
        recordLoginAttempt(ip, true);
        await writeAuditLog({
            action: "LOGIN_SUCCESS",
            category: "auth",
            details: `SuperAdmin login successful. 2FA: ${totpCode ? "verified" : "skipped"}`,
            ip,
            userAgent,
            success: true,
        });

        // Set secure cookie
        const response = NextResponse.json({
            success: true,
            token: encryptedToken,
            requires2FA: !totpCode,
            expiresIn: "2h",
        });

        response.cookies.set("sa_session", encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7200, // 2 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("[SUPERADMIN AUTH] Error:", error);
        await writeAuditLog({
            action: "LOGIN_ERROR",
            category: "auth",
            details: `Server error during login: ${error instanceof Error ? error.message : "Unknown"}`,
            ip,
            userAgent,
            success: false,
        });
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
