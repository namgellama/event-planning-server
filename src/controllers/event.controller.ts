import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as eventService from "../services/event.service.js";
import { sendResponse } from "../utils/response.js";

export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await eventService.getAll(req.user.id);

    sendResponse(res, events, "All events fetched successfully");
});

export const getEvent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const event = await eventService.getById(req.params.id, req.user.id);

    sendResponse(res, event, "Event fetched successfully");
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.create(req.body, req.user.id);

    sendResponse(res, event, "Event created successfully", 201);
});
