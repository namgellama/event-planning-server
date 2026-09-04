import { Router } from "express";
import * as tagController from "../controllers/tag.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createTagSchema } from "../validations/tag.validation.js";

const router = Router();

router.get("/", protect, tagController.getAllTags);
router.get("/:id", protect, tagController.getTag);
router.post("/", protect, validateBody(createTagSchema), tagController.createTag);

export default router;
