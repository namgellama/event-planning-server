import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as authService from "../services/auth.service.js";
import { sendResponse } from "../utils/response.js";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(res, user, "User registered successfully", 201);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.login(res, req.body);

    sendResponse(res, tokens, "User logged in successfully");
});
