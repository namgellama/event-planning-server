import z from "zod";
import "../config/zod-extend.js";
import { paginationSchema, sortOrderSchema } from "./query.validation.js";
import { paginatedResponseSchema } from "./request-response.validation.js";

export const tagInputShape = z.object({
    title: z.string().nonempty("Title is required"),
});

export const createTagSchema = tagInputShape.openapi("CreateTagInput");

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = tagInputShape.partial().openapi("UpdateTagInput");

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export const tagQuerySchema = paginationSchema
    .extend({
        search: z.string().trim().optional(),
        sortBy: z.enum(["title", "createdAt"]).optional().default("createdAt"),
        ...sortOrderSchema.shape,
    })
    .openapi("TagQuery");

export type TagQuery = z.infer<typeof tagQuerySchema>;

export const tagItemSchema = z
    .object({
        id: z.string().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
        title: z.string().openapi({ example: "Tech" }),
    })
    .openapi("TagItem");

export const tagSchema = z
    .object({
        id: z.string().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
        title: z.string().openapi({ example: "Tech" }),
        userId: z.string().openapi({ example: "64f1c2e5a3b9d2f1a8e4c9d3" }),
        createdAt: z.iso.datetime(),
        updatedAt: z.iso.datetime(),
    })
    .openapi("Tag");

export const paginatedTagsSchema = paginatedResponseSchema(tagSchema).openapi("PaginatedTags");
