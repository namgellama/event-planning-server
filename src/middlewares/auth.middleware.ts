import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import * as userRepository from "../repositories/user.repository.js";
import { verifyToken } from "../utils/jwt.js";

export async function protect(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            next(new AppError(401, "Not authenticated - no token found"));
            return;
        }

        const token = authHeader.slice(7).trim();

        const payload = verifyToken(token, env.JWT_ACCESS_SECRET);

        const user = await userRepository.findById(payload.sub);

        if (!user) {
            next(new AppError(401, "Not authenticated - user not found"));
            return;
        }

        req.user = {
            id: user.id,
        };

        next();
    } catch (error) {
        next(error);
    }
}
