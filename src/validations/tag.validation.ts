import z from "zod";
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
