import { Router } from "express";
import * as rsvpController from "../controllers/rsvp.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createRsvpSchema } from "../validations/rsvp.validation.js";

const router = Router({ mergeParams: true });

router.get("/me", protect, rsvpController.fetchMyRsvp);
router.post("/", protect, validateBody(createRsvpSchema), rsvpController.createRsvp);
router.patch("/", protect, validateBody(createRsvpSchema), rsvpController.updateRsvp);

export default router;
