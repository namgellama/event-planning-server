import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/async-handler.middleware.js";
import * as tagService from "@/services/tag.service.js";
import { sendResponse } from "@/utils/response.js";
import { tagQuerySchema } from "@/validations/tag.validation.js";

/*
 * @desc Get all tags
 * @route GET /api/v1/tags
 * @access Private
 */
export const getAllTags = asyncHandler(async (req: Request, res: Response) => {
    const query = tagQuerySchema.parse(req.query);

    const tags = await tagService.getAllTags(query);

    sendResponse(res, tags, "All tags fetched successfully");
});

/*
 * @desc Get tag details
 * @route GET /api/v1/tags/:id
 * @access Private
 */
export const getTagDetails = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const tag = await tagService.getTagById(req.params.id);

    sendResponse(res, tag, "Tag details fetched successfully");
});

/*
 * @desc Create tag
 * @route POST /api/v1/tags
 * @access Private/Admin
 */
export const createTag = asyncHandler(async (req: Request, res: Response) => {
    const tag = await tagService.createTag(req.body, req.user.id);

    sendResponse(res, tag, "Tag created successfully", 201);
});

/*
 * @desc Update tag
 * @route PATCH /api/v1/tags/:id
 * @access Private/Admin
 */
export const updateTag = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const tag = await tagService.updateTag(req.params.id, req.body);

    sendResponse(res, tag, "Tag updated successfully");
});

/*
 * @desc Delete tag
 * @route DELETE /api/v1/tags/:id
 * @access Private/Admin
 */
export const deleteTag = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await tagService.deleteTag(req.params.id);

    res.status(204).end();
});
