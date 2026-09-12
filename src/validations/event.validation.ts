import z from "zod";
import { paginationSchema, sortOrderSchema } from "./query.validation.js";

export const createEventSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters"),
    description: z.string().trim().nullable().optional(),
    date: z.iso.datetime({ offset: true }),
    location: z
        .string()
        .trim()
        .min(3, "Location must be 3 characters")
        .max(255, "Location must not exceed 255 characters"),
    type: z.enum(["public", "private"]).default("public"),
    status: z.enum(["upcoming", "completed"]).default("upcoming"),
    tags: z
        .array(z.uuid())
        .refine((tags) => new Set(tags).size === tags.length, {
            message: "Tags must be unique",
        })
        .optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema.partial();

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const eventQuerySchema = paginationSchema.extend({
    type: z.enum(["public", "private"]).optional(),
    status: z.enum(["upcoming", "completed"]).optional(),
    tags: z
        .string()
        .transform((value) =>
            value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        )
        .pipe(z.array(z.uuid()))
        .optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(["date", "createdAt", "title", "popularity"]).optional().default("createdAt"),
    ...sortOrderSchema.shape,
});

export type EventQuery = z.infer<typeof eventQuerySchema>;
