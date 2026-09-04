import type { CreateEventInput } from "../validations/event.validation.js";

export type Event = CreateEventInput & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
};
