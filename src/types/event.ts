import type { TagItem } from "./tag.js";

export type EventType = "public" | "private";

export type Event = {
    id: string;
    title: string;
    description?: string | null | undefined;
    date: string;
    location: string;
    type: EventType;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
};

export type EventItem = Event & {
    tags: TagItem[];
    going: number;
    notGoing: number;
    maybe: number;
};

export type EventListItem = Event & {
    tags: TagItem[];
    popularity: number;
};

export type EventWithTagIds = Event & {
    tags: string[];
};
