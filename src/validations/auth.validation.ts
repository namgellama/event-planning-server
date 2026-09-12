import z from "zod";

export const sendOtpSchema = z.object({
    email: z.email().trim(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
    email: z.email().trim(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const registerUserSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.email().trim(),
    password: z.string().min(5, "Password must be at least 5 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
    email: z.email().trim(),
    password: z.string().nonempty("Password is required"),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
