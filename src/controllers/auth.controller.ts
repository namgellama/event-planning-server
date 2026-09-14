import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as authService from "../services/auth.service.js";
import { sendResponse } from "../utils/response.js";

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
    await authService.sendOtp(req.body);

    sendResponse(res, null, "Otp has been sent to your email");
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    await authService.verifyEmail(req.body);

    sendResponse(res, null, "Email verified successfully");
});

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(res, user, "User registered successfully", 201);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.login(res, req.body);

    sendResponse(res, tokens, "User logged in successfully");
});

export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    await authService.logout(res);

    sendResponse(res, null, "User logged out successfully");
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const accessToken = await authService.refreshToken(req);

    sendResponse(res, accessToken, "Token refreshed successfully");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user.id);

    sendResponse(res, user, "Current user fetched successfully");
});

export const setup2FA = asyncHandler(async (req: Request, res: Response) => {
    const { qrCode } = await authService.setup2FA(req.user.id);

    sendResponse(res, { qrCode }, "2FA setup initiated successfully");
});

export const verify2FA = asyncHandler(async (req: Request, res: Response) => {
    await authService.verify2FA(req.body, req.user.id);

    sendResponse(res, null, "2FA enabled successfully");
});
