import type { RegisterUserInput } from "../validations/auth.validation.js";

export type UserRole = "user" | "admin";

export type User = RegisterUserInput & {
    id: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};
