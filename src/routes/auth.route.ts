import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { registerUserSchema } from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), authController.register);

export default router;
