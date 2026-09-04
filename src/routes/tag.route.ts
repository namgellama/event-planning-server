import { Router } from "express";
import * as tagController from "../controllers/tag.controller.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createTagSchema } from "../validations/tag.validation.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, validateBody(createTagSchema), tagController.createTag);

export default router;
