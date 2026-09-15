import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler.middleware.js";
import * as authService from "@/services/auth.service.js";
import { sendResponse } from "@/utils/response.js";

/*
 * @desc Send otp
 * @route POST /api/v1/auth/register/send-otp
 * @access Public
 */
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
    await authService.sendOtp(req.body);

    sendResponse(res, null, "Otp has been sent to your email");
});

/*
 * @desc Verify email
 * @route POST /api/v1/auth/register/verify-email
 * @access Public
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    await authService.verifyEmail(req.body);

    sendResponse(res, null, "Email verified successfully");
});

/*
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    sendResponse(res, user, "User registered successfully", 201);
});

/*
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.login(res, req.body);

    sendResponse(
        res,
        data,
        data.requires2FA
            ? "Authenticate using your authenticator app"
            : "User logged in successfully",
    );
});

/*
 * @desc Logout user
 * @route POST /api/v1/auth/logout
 * @access Public
 */
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
    await authService.logout(res);

    sendResponse(res, null, "User logged out successfully");
});

/*
 * @desc Refresh token
 * @route POST /api/v1/auth/refresh-token
 * @access Public
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const accessToken = await authService.refreshToken(req);

    sendResponse(res, accessToken, "Token refreshed successfully");
});

/*
 * @desc Get logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user.id);

    sendResponse(res, user, "Current user fetched successfully");
});

/*
 * @desc Setup 2FA
 * @route POST /api/v1/auth/2fa/setup
 * @access Private
 */
export const setup2FA = asyncHandler(async (req: Request, res: Response) => {
    const { qrCode } = await authService.setup2FA(req.user.id);

    sendResponse(res, { qrCode }, "2FA setup initiated successfully");
});

/*
 * @desc Verify 2FA setup
 * @route POST /api/v1/auth/2fa/verify-setup
 * @access Private
 */
export const verify2FASetup = asyncHandler(async (req: Request, res: Response) => {
    await authService.verify2FASetup(req.body, req.user.id);

    sendResponse(res, null, "2FA enabled successfully");
});

/*
 * @desc Verify 2FA
 * @route POST /api/v1/auth/2fa/verify
 * @access Public
 */
export const verify2FA = asyncHandler(async (req: Request, res: Response) => {
    const data = await authService.verify2FA(req.body, res);

    sendResponse(res, data, "2FA verified successfully");
});

/*
 * @desc Disable 2FA
 * @route POST /api/v1/auth/2fa/disable
 * @access Private
 */
export const disable2FA = asyncHandler(async (req: Request, res: Response) => {
    await authService.disable2FA(req.body, req.user.id);

    sendResponse(res, null, "2FA disabled successfully");
});
