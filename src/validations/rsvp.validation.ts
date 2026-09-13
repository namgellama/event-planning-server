import z from "zod";
import "../config/zod-extend.js";

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
