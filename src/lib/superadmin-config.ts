// SuperAdmin Configuration - Security Core
// WARNING: Do not expose this file to the client
// All secrets MUST come from environment variables

import bcryptjs from "bcryptjs";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

// ============================================
// ALL CREDENTIALS LOADED FROM ENV VARS
// ============================================

const SUPERADMIN_USERNAME = "superadmin";

// Pre-hashed password stored in environment variable
const SUPERADMIN_PASSWORD_HASH = process.env.SUPERADMIN_PASSWORD_HASH || "";

// JWT Configuration — MUST be set in env
const JWT_SECRET = process.env.SUPERADMIN_JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("SUPERADMIN_JWT_SECRET environment variable is required");
}
const JWT_EXPIRY = "2h";

// AES-256 Encryption Key — MUST be set in env
const AES_SECRET = process.env.SUPERADMIN_AES_SECRET;
if (!AES_SECRET) {
    throw new Error("SUPERADMIN_AES_SECRET environment variable is required");
}

// TOTP Secret (for 2FA) — MUST be set in env
const TOTP_SECRET = process.env.SUPERADMIN_TOTP_SECRET;
if (!TOTP_SECRET) {
    throw new Error("SUPERADMIN_TOTP_SECRET environment variable is required");
}

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
    if (!SUPERADMIN_PASSWORD_HASH) return false;
    return bcryptjs.compare(password, SUPERADMIN_PASSWORD_HASH);
}

export function generateJWT(payload: object): string {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: JWT_EXPIRY,
        algorithm: "HS256",
        issuer: "asterika-superadmin",
        audience: "asterika-admin-portal",
    });
}

export function verifyJWT(token: string): jwt.JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET!, {
            issuer: "asterika-superadmin",
            audience: "asterika-admin-portal",
        }) as jwt.JwtPayload;
    } catch {
        return null;
    }
}

export function encryptSession(data: string): string {
    return CryptoJS.AES.encrypt(data, AES_SECRET!).toString();
}

export function decryptSession(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, AES_SECRET!);
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
    return TOTP_SECRET!;
}

export { SUPERADMIN_USERNAME };
