import z from "zod";
import "../config/zod-extend.js";
import { paginationSchema, sortOrderSchema } from "./query.validation.js";

export const createTagSchema = z.object({
    title: z.string().nonempty("Title is required"),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export const tagQuerySchema = paginationSchema.extend({
    search: z.string().trim().optional(),
    sortBy: z.enum(["title", "createdAt"]).optional().default("createdAt"),
    ...sortOrderSchema.shape,
});

export type TagQuery = z.infer<typeof tagQuerySchema>;

export const tagItemSchema = z
    .object({
        id: z.string().openapi({ example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" }),
        title: z.string().openapi({ example: "Tech" }),
    })
    .openapi("TagItem");
