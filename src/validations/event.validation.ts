import z from "zod";
import "../config/zod-extend.js";
import { paginationSchema, sortOrderSchema } from "./query.validation.js";
import { paginatedResponseSchema } from "./request-response.validation.js";
import { tagItemSchema } from "./tag.validation.js";

export const eventInputShape = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters")
        .openapi({ example: "Community Meetup" }),
    description: z.string().trim().nullable().optional().openapi({
        example: "A monthly gathering for the local tech community.",
    }),
    date: z.iso.datetime({ offset: true }).openapi({
        example: "2026-10-01T18:00:00+05:45",
    }),
    location: z
        .string()
        .trim()
        .min(3, "Location must be 3 characters")
        .max(255, "Location must not exceed 255 characters")
        .openapi({ example: "Kathmandu, Nepal" }),
    type: z.enum(["public", "private"]).default("public").openapi({ example: "public" }),
    status: z.enum(["upcoming", "completed"]).default("upcoming").openapi({ example: "upcoming" }),
    tags: z
        .array(z.uuid())
        .refine((tags) => new Set(tags).size === tags.length, {
            message: "Tags must be unique",
        })
        .optional()
        .openapi({
            description: "Tag IDs to associate with this event (must be unique)",
            example: ["7c9e6679-7425-40de-944b-e07fc1f90ae7"],
        }),
});

export const createEventSchema = eventInputShape.openapi("CreateEventInput");

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = eventInputShape.partial().openapi("UpdateEventInput");

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const eventQuerySchema = paginationSchema
    .extend({
        type: z.enum(["public", "private"]).optional().openapi({
            description: "Filter by event visibility",
        }),
        status: z.enum(["upcoming", "completed"]).optional().openapi({
            description: "Filter by event status",
        }),
        tags: z
            .string()
            .transform((value) =>
                value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            )
            .pipe(z.array(z.uuid()))
            .optional()
            .openapi({
                description: "Comma-separated tag UUIDs",
            }),
        search: z.string().trim().optional(),
        sortBy: z
            .enum(["date", "createdAt", "title", "popularity"])
            .optional()
            .default("createdAt"),
        rsvpStatus: z.enum(["yes", "no", "maybe"]).optional(),
        ...sortOrderSchema.shape,
    })
    .openapi("EventQuery");

export type EventQuery = z.infer<typeof eventQuerySchema>;

export const rsvpStatusSchema = z.enum(["yes", "no", "maybe"]).openapi("RsvpStatus");

export const rsvpCountsSchema = z
    .object({
        yes: z.number().openapi({ example: 12 }),
        no: z.number().openapi({ example: 3 }),
        maybe: z.number().openapi({ example: 5 }),
    })
    .openapi("RsvpCounts");

export const eventBaseSchema = z.object({
    id: z.string().openapi({ example: "64f1c2e5a3b9d2f1a8e4c9d3" }),
    title: z.string().openapi({ example: "Community Meetup" }),
    description: z.string().nullable().openapi({
        example: "A monthly gathering for the local tech community.",
    }),
    location: z.string().openapi({ example: "Kathmandu, Nepal" }),
    date: z.iso.datetime({ offset: true }).openapi({ example: "2026-10-01T18:00:00+05:45" }),
    type: z.enum(["public", "private"]),
    status: z.enum(["upcoming", "completed"]),
    createdAt: z.iso.datetime(),
    tags: z.array(tagItemSchema),
    rsvp: rsvpCountsSchema,
});

export const eventListItemSchema = eventBaseSchema
    .extend({
        myRsvp: rsvpStatusSchema.optional(),
    })
    .openapi("EventListItem");

export const eventItemSchema = eventBaseSchema.openapi("EventItem");

export const paginatedEventsSchema =
    paginatedResponseSchema(eventListItemSchema).openapi("PaginatedEvents");

export const eventWithTagIdsSchema = eventBaseSchema
    .omit({ tags: true, rsvp: true })
    .extend({
        tags: z.array(z.uuid()).openapi({
            description: "IDs of tags associated with this event",
        }),
    })
    .openapi("EventWithTagIds");
