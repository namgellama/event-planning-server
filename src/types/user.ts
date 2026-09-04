import type { RegisterUserInput } from "../validations/auth.validation.js";

export type User = RegisterUserInput & {
    id: string;
    createdAt: string;
    updatedAt: string;
};
