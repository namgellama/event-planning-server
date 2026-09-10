import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import { admin, protect } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createEventSchema, updateEventSchema } from "../validations/event.validation.js";

const router = Router();

router.get("/", protect, eventController.getAllEvents);
router.get("/:id", protect, eventController.getEvent);
router.post("/", protect, admin, validateBody(createEventSchema), eventController.createEvent);
router.patch("/:id", protect, admin, validateBody(updateEventSchema), eventController.updateEvent);
router.delete("/:id", protect, admin, eventController.deleteEvent);

export default router;
