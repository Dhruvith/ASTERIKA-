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

// Values (with build-time safety)
export const SUPERADMIN_PASSWORD_HASH = process.env.SUPERADMIN_PASSWORD_HASH || "";
export const JWT_SECRET = process.env.SUPERADMIN_JWT_SECRET || "";
export const AES_SECRET = process.env.SUPERADMIN_AES_SECRET || "";
export const TOTP_SECRET = process.env.SUPERADMIN_TOTP_SECRET || "";

// Validation function helper
const validateConfig = () => {
    if (!JWT_SECRET || !AES_SECRET || !TOTP_SECRET || !SUPERADMIN_PASSWORD_HASH) {
        console.error("❌ CRITICAL: SuperAdmin environment variables are missing.");
        return false;
    }
    return true;
};

// JWT Configuration
const JWT_EXPIRY = "2h";

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
    if (!validateConfig()) return false;
    if (username !== SUPERADMIN_USERNAME) return false;
    return bcryptjs.compare(password, SUPERADMIN_PASSWORD_HASH);
}

export function generateJWT(payload: object): string {
    if (!validateConfig()) throw new Error("Security configuration missing");
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
        algorithm: "HS256",
        issuer: "asterika-superadmin",
        audience: "asterika-admin-portal",
    });
}

export function verifyJWT(token: string): jwt.JwtPayload | null {
    if (!validateConfig()) return null;
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
    if (!validateConfig()) throw new Error("Security configuration missing");
    return CryptoJS.AES.encrypt(data, AES_SECRET).toString();
}

export function decryptSession(ciphertext: string): string {
    if (!validateConfig()) return "";
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
    if (!validateConfig()) throw new Error("Security configuration missing");
    return TOTP_SECRET;
}

export { SUPERADMIN_USERNAME };
