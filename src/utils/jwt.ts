import jwt from "jsonwebtoken";
import type ms from "ms";
import { AppError } from "../errors/app-error.js";

export function signToken(payload: { sub: string }, secret: string, expiry: string) {
    return jwt.sign(payload, secret, {
        expiresIn: expiry as ms.StringValue,
    });
}

export function verifyToken(token: string, secret: string) {
    try {
        return jwt.verify(token, secret) as { sub: string };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError(401, "Token expired");
        }

        throw new AppError(401, "Invalid token");
    }
}
