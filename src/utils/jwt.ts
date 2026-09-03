import jwt from "jsonwebtoken";
import type ms from "ms";

export function signToken(payload: { sub: string }, secret: string, expiry: string) {
    return jwt.sign(payload, secret, {
        expiresIn: expiry as ms.StringValue,
    });
}
