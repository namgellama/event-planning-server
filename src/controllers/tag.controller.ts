import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as tagService from "../services/tag.service.js";
import { sendResponse } from "../utils/response.js";

export const getAllTags = asyncHandler(async (req: Request, res: Response) => {
    const tags = await tagService.getAll(req.user.id);

    sendResponse(res, tags, "All tags fetched successfully");
});

export const getTag = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const tag = await tagService.getById(req.params.id, req.user.id);

    sendResponse(res, tag, "Tag fetched successfully");
});

export const createTag = asyncHandler(async (req: Request, res: Response) => {
    const tag = await tagService.create(req.body, req.user.id);

    sendResponse(res, tag, "Tag created successfully", 201);
});
