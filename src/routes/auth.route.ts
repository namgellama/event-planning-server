import { Router } from "express";

import * as authController from "@/controllers/auth.controller.js";
import { protect } from "@/middlewares/auth.middleware.js";
import { validateBody } from "@/middlewares/validate-body.middleware.js";
import {
    disable2FASchema,
    loginUserSchema,
    registerUserSchema,
    sendOtpSchema,
    verify2FASchema,
    verify2FASetupSchema,
    verifyEmailSchema,
} from "@/validations/auth.validation.js";

const router = Router();

router.post("/register/send-otp", validateBody(sendOtpSchema), authController.sendOtp);
router.post("/register/verify-email", validateBody(verifyEmailSchema), authController.verifyEmail);
router.post("/register", validateBody(registerUserSchema), authController.registerUser);
router.post("/login", validateBody(loginUserSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);

router.get("/me", protect, authController.getMe);

router.post("/2fa/setup", protect, authController.setup2FA);
router.post(
    "/2fa/verify-setup",
    protect,
    validateBody(verify2FASetupSchema),
    authController.verify2FASetup,
);
router.post("/2fa/verify", validateBody(verify2FASchema), authController.verify2FA);
router.post("/2fa/disable", protect, validateBody(disable2FASchema), authController.disable2FA);

export default router;
