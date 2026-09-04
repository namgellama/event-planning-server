import type { CreateTagInput } from "../validations/tag.validation.js";

export type Tag = CreateTagInput & {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};
