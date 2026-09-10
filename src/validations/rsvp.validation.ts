import z from "zod";

export const createRsvpSchema = z.object({
    status: z.enum(["yes", "no", "maybe"]),
});

export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;
