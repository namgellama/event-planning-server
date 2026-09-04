import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createEventSchema } from "../validations/event.validation.js";

const router = Router();

router.get("/", protect, eventController.getAllEvents);
router.post("/", protect, validateBody(createEventSchema), eventController.createEvent);

export default router;
