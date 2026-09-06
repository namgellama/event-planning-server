import z from "zod";

export const createTagSchema = z.object({
    title: z.string().nonempty("Title is required"),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();

export type UpdateTagInput = z.infer<typeof updateTagSchema>;
