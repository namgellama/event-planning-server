import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";
import { logger } from "../config/logger.js";

export async function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (error instanceof ZodError) {
        return res
            .status(400)
            .json({ success: false, message: "Validation error", errors: error.issues });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    logger.fatal(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
}
