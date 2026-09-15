import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler.middleware.js";
import * as eventService from "@/services/event.service.js";
import { sendResponse } from "@/utils/response.js";
import { eventQuerySchema } from "@/validations/event.validation.js";

/*
 * @desc Get all events
 * @route GET /api/v1/events
 * @access Private
 */
export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const query = eventQuerySchema.parse(req.query);

    const events = await eventService.getAllEvents(query, req.user);

    sendResponse(res, { ...events }, "All events fetched successfully");
});

/*
 * @desc Get event details
 * @route GET /api/v1/events/:id
 * @access Private
 */
export const getEventDetails = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const event = await eventService.getEventDetailsById(req.params.id);

    sendResponse(res, event, "Event details fetched successfully");
});

/*
 * @desc Create event
 * @route POST /api/v1/events
 * @access Private/Admin
 */
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.createEvent(req.body, req.user.id);

    sendResponse(res, event, "Event created successfully", 201);
});

/*
 * @desc Update event
 * @route POST /api/v1/events/:id
 * @access Private/Admin
 */
export const updateEvent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);

    sendResponse(res, event, "Event updated successfully");
});

/*
 * @desc Delete event
 * @route DELETE /api/v1/events/:id
 * @access Private/Admin
 */
export const deleteEvent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await eventService.deleteEvent(req.params.id, req.user.id);

    res.status(204).end();
});
