import type { CreateEventInput } from "../validations/event.validation.js";
import type { Tag } from "./tag.js";

export type Event = Omit<CreateEventInput, "tags"> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    tags: string[];
};

export type EventDetails = Omit<Event, "tags"> & {
    tags: Pick<Tag, "id" | "title">[];
};

export type EventTag = {
    eventId: string;
    tagId: string;
};
