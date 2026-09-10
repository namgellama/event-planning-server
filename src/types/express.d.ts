import "express";
import type { UserRole } from "./user.ts";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: UserRole;
            };
        }
    }
}

export {};
