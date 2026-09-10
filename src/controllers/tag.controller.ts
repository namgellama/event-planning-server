import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware.js";
import * as tagService from "../services/tag.service.js";
import { sendResponse } from "../utils/response.js";
import { tagQuerySchema } from "../validations/tag.validation.js";

export const getAllTags = asyncHandler(async (req: Request, res: Response) => {
    const query = tagQuerySchema.parse(req.query);

    const tags = await tagService.getAll(req.user.id, query);

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

export const updateTag = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const tag = await tagService.update(req.params.id, req.body, req.user.id);

    sendResponse(res, tag, "Tag updated successfully");
});

export const deleteTag = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await tagService.remove(req.params.id, req.user.id);

    sendResponse(res, null, "Tag deleted successfully", 204);
});
