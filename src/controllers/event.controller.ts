import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as eventService from "../services/event.service.js";
import { sendResponse } from "../utils/response.js";
import { paginationSchema } from "../validations/pagination.validation.js";

export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = paginationSchema.parse(req.query);

    const events = await eventService.getAll(req.user.id, page, limit);

    sendResponse(res, { ...events }, "All events fetched successfully");
});

export const getEvent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const event = await eventService.getById(req.params.id, req.user.id);

    sendResponse(res, event, "Event fetched successfully");
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.create(req.body, req.user.id);

    sendResponse(res, event, "Event created successfully", 201);
});

export const updateEvent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const event = await eventService.update(req.params.id, req.body, req.user.id);

    sendResponse(res, event, "Event updated successfully");
});

export const deleteEvent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await eventService.remove(req.params.id, req.user.id);

    sendResponse(res, null, "Event deleted successfully", 204);
});
