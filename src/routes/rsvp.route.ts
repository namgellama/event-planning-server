import { Router } from "express";

import * as rsvpController from "@/controllers/rsvp.controller.js";
import { admin, protect } from "@/middlewares/auth.middleware.js";
import { validateBody } from "@/middlewares/validate-body.middleware.js";
import { createRSVPSchema, updateRSVPSchema } from "@/validations/rsvp.validation.js";

const router = Router({ mergeParams: true });

router.get("/", protect, admin, rsvpController.getAllRSVPs);
router.get("/me", protect, rsvpController.getMyRSVP);
router.post("/", protect, validateBody(createRSVPSchema), rsvpController.createRSVP);
router.patch("/", protect, validateBody(updateRSVPSchema), rsvpController.updateRSVP);

export default router;
