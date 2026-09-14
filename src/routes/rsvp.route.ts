import { Router } from "express";
import * as rsvpController from "../controllers/rsvp.controller.js";
import { admin, protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createRsvpSchema, updateRsvpSchema } from "../validations/rsvp.validation.js";

const router = Router({ mergeParams: true });

router.get("/", protect, admin, rsvpController.fetchAllRsvps);
router.get("/me", protect, rsvpController.fetchMyRsvp);
router.post("/", protect, validateBody(createRsvpSchema), rsvpController.createRsvp);
router.patch("/", protect, validateBody(updateRsvpSchema), rsvpController.updateRsvp);

export default router;
