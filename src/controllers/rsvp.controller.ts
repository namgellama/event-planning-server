import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler.middleware.js";
import * as rsvpService from "@/services/rsvp.service.js";
import { sendResponse } from "@/utils/response.js";
import { rsvpQuerySchema } from "@/validations/rsvp.validation.js";

/*
 * @desc Get all RSVPs
 * @route GET /api/v1/events/:id/rsvps
 * @access Private/Admin
 */
export const getAllRSVPs = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const query = rsvpQuerySchema.parse(req.query);

    const rsvp = await rsvpService.getAllRSVPs(query, req.params.id);

    sendResponse(res, rsvp, "All RSVPs fetched successfully");
});

/*
 * @desc Get my RSVP
 * @route GET /api/v1/events/:id/rsvps/me
 * @access Private
 */
export const getMyRSVP = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const rsvp = await rsvpService.getRSVPByEventAndUser(req.params.id, req.user.id);

    sendResponse(res, rsvp, "My RSVP fetched successfully");
});

/*
 * @desc Create RSVP
 * @route POST /api/v1/events/:id/rsvps
 * @access Private
 */
export const createRSVP = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const rsvp = await rsvpService.createRSVP(req.body, req.params.id, req.user.id);

    sendResponse(res, rsvp, "RSVP created successfully", 201);
});

/*
 * @desc Update RSVP
 * @route PATCH /api/v1/events/:id/rsvps
 * @access Private
 */
export const updateRSVP = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const rsvp = await rsvpService.updateRSVP(req.body, req.params.id, req.user.id);

    sendResponse(res, rsvp, "RSVP updated successfully");
});
