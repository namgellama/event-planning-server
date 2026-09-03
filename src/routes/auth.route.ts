import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { loginUserSchema, registerUserSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), authController.registerUser);
router.post("/login", validateBody(loginUserSchema), authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", protect, authController.getMe);

export default router;
