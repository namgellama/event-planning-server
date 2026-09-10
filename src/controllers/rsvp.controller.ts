import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as rsvpService from "../services/rsvp.service.js";
import { sendResponse } from "../utils/response.js";

export const fetchMyRsvp = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const rsvp = await rsvpService.getByEventAndUser(req.params.id, req.user.id);

    sendResponse(res, rsvp, "My rsvp fetched successfully");
});

export const createRsvp = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const rsvp = await rsvpService.create(req.body, req.params.id, req.user.id);

    sendResponse(res, rsvp, "Rsvp created successfully", 201);
});
