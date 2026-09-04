import z from "zod";

export const createEventSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must not exceed 100 characters"),
    description: z.string().nullable(),
    date: z.iso.datetime({ offset: true }),
    location: z
        .string()
        .trim()
        .min(3, "Location must be 3 characters")
        .max(255, "Location must not exceed 255 characters"),
    visibility: z.enum(["public", "private"]).default("public"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
