import type { CreateEventInput } from "../validations/event.validation.js";

export type Event = CreateEventInput & {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
};
