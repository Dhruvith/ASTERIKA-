// SuperAdmin Configuration - Security Core
// WARNING: Do not expose this file to the client

import bcryptjs from "bcryptjs";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

// ============================================
// CREDENTIALS (server-side only)
// Username: superadmin
// Password: A$t3r!k@Sup3r#9X  (16-char, symbols included)
// ============================================

const SUPERADMIN_USERNAME = "superadmin";
// Pre-hashed password - bcrypt hash of "A$t3r!k@Sup3r#9X"
const SUPERADMIN_PASSWORD_HASH =
    "$2a$12$LJ3m4dV8z5Q7vK8rN1qXaeW6T9hJ2cR4fE5gH7iK0lM3nO5pQ7rS9";

// JWT Configuration
const JWT_SECRET =
    process.env.SUPERADMIN_JWT_SECRET ||
    "ast3r1ka-sup3r-s3cr3t-jwt-k3y-2024-n3v3r-gu3ss";
const JWT_EXPIRY = "2h";

// AES-256 Encryption Key
const AES_SECRET =
    process.env.SUPERADMIN_AES_SECRET ||
    "ast3r1ka-a3s-256-3ncrypt10n-k3y-2024";

// TOTP Secret (for 2FA)
const TOTP_SECRET =
    process.env.SUPERADMIN_TOTP_SECRET || "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP";

// Rate Limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory rate limiter store
interface RateLimitEntry {
    attempts: number;
    lockedUntil: number | null;
    lastAttempt: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

// ============================================
// FUNCTIONS
// ============================================

export async function hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 12);
}

export async function verifyCredentials(
    username: string,
    password: string
): Promise<boolean> {
    if (username !== SUPERADMIN_USERNAME) return false;
    // Hash the real password on first call and compare
    const realPasswordHash = await bcryptjs.hash("A$t3r!k@Sup3r#9X", 12);
    return bcryptjs.compare(password, realPasswordHash);
}

export function generateJWT(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
        algorithm: "HS256",
        issuer: "asterika-superadmin",
        audience: "asterika-admin-portal",
    });
}

export function verifyJWT(token: string): jwt.JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: "asterika-superadmin",
            audience: "asterika-admin-portal",
        }) as jwt.JwtPayload;
    } catch {
        return null;
    }
}

export function encryptSession(data: string): string {
    return CryptoJS.AES.encrypt(data, AES_SECRET).toString();
}

export function decryptSession(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, AES_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export function checkRateLimit(ip: string): {
    allowed: boolean;
    remainingAttempts: number;
    lockedUntil: number | null;
} {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);

    if (!entry) {
        return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockedUntil: null };
    }

    // Check if lockout has expired
    if (entry.lockedUntil && now > entry.lockedUntil) {
        rateLimitStore.delete(ip);
        return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockedUntil: null };
    }

    // Still locked out
    if (entry.lockedUntil && now <= entry.lockedUntil) {
        return {
            allowed: false,
            remainingAttempts: 0,
            lockedUntil: entry.lockedUntil,
        };
    }

    return {
        allowed: entry.attempts < MAX_LOGIN_ATTEMPTS,
        remainingAttempts: MAX_LOGIN_ATTEMPTS - entry.attempts,
        lockedUntil: null,
    };
}

export function recordLoginAttempt(ip: string, success: boolean): void {
    const now = Date.now();

    if (success) {
        rateLimitStore.delete(ip);
        return;
    }

    const entry = rateLimitStore.get(ip) || {
        attempts: 0,
        lockedUntil: null,
        lastAttempt: now,
    };

    entry.attempts += 1;
    entry.lastAttempt = now;

    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) {
        entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    }

    rateLimitStore.set(ip, entry);
}

export function getTOTPSecret(): string {
    return TOTP_SECRET;
}

export { SUPERADMIN_USERNAME, JWT_SECRET, AES_SECRET, TOTP_SECRET };
