import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as authService from "../services/auth.service.js";
import { sendResponse } from "../utils/response.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(res, user, "User registered successfully", 201);
});
