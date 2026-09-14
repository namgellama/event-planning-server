import jwt from "jsonwebtoken";
import type ms from "ms";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import type { UserRole } from "../types/user.js";

export function signToken(
    payload: { sub: string; role: UserRole; type: "access" | "refresh" },
    secret: string,
    expiry: string,
) {
    return jwt.sign(payload, secret, {
        expiresIn: expiry as ms.StringValue,
    });
}

export function verifyToken(token: string, secret: string) {
    try {
        return jwt.verify(token, secret) as {
            sub: string;
            role: UserRole;
            type: "access" | "refresh";
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(401, "Token expired");
        }

        throw new AppError(401, "Invalid token");
    }
}

export function generate2FAToken(userId: string) {
    return jwt.sign(
        {
            sub: userId,
            type: "2fa",
        },
        env.JWT_2FA_SECRET,
        {
            expiresIn: env.JWT_2FA_EXPIRY,
        },
    );
}

export function verify2FAToken(token: string) {
    try {
        const payload = jwt.verify(token, env.JWT_2FA_SECRET) as { sub: string; type: string };

        if (
            typeof payload === "string" ||
            payload.type !== "2fa" ||
            typeof payload.sub !== "string"
        ) {
            throw new AppError(401, "Invalid 2FA token");
        }

        return payload;
    } catch {
        throw new AppError(401, "Invalid or expired 2FA token");
    }
}
