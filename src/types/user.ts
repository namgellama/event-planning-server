import type { RegisterUserInput } from "../validations/auth.validation.js";

export type User = RegisterUserInput & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};
