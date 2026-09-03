import z from "zod";

export const registerUserSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.email().trim(),
    password: z.string().min(5, "Password must be at least 5 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
