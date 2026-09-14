import z from "zod";
import "../config/zod-extend.js";
import { paginationSchema, sortOrderSchema } from "./query.validation.js";
import { paginatedResponseSchema } from "./request-response.validation.js";

export const rsvpInputShape = z.object({
    status: z.enum(["yes", "no", "maybe"]),
});

export const createRsvpSchema = rsvpInputShape.openapi("CreateRsvpInput");

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;

export const updateRsvpSchema = rsvpInputShape.openapi("UpdateRsvpInput");

export type UpdateRsvpInput = z.infer<typeof updateRsvpSchema>;

export const rsvpStatusSchema = z.enum(["yes", "no", "maybe"]).openapi("RsvpStatus");

export const rsvpSchema = z
    .object({
        eventId: z.string().openapi({ example: "64f1c2e5a3b9d2f1a8e4c9d3" }),
        userId: z.string().openapi({ example: "64f1c2e5a3b9d2f1a8e4c9d4" }),
        status: rsvpStatusSchema,
        createdAt: z.iso.datetime(),
        updatedAt: z.iso.datetime(),
    })
    .openapi("Rsvp");

export const rsvpQuerySchema = paginationSchema
    .extend({
        status: z.enum(["yes", "no", "maybe"]).optional().openapi({
            description: "Filter by rsvp status",
        }),
        search: z.string().trim().optional(),
        sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
        ...sortOrderSchema.shape,
    })
    .openapi("RsvpQuery");

export type RsvpQuery = z.infer<typeof rsvpQuerySchema>;

const rsvpUserSchema = z
    .object({
        id: z.uuid(),
        name: z.string(),
        email: z.email(),
    })
    .openapi("RsvpUser");

const rsvpListItemSchema = z
    .object({
        eventId: z.uuid(),
        userId: z.uuid(),
        status: z.enum(["yes", "no", "maybe"]),
        createdAt: z.iso.datetime(),
        updatedAt: z.iso.datetime(),
        user: rsvpUserSchema,
    })
    .openapi("RsvpListItem");

export const paginatedRsvpsSchema =
    paginatedResponseSchema(rsvpListItemSchema).openapi("PaginatedRsvps");
