import type { RsvpStatus } from "./rsvp.js";
import type { TagItem } from "./tag.js";

export type EventType = "public" | "private";
export type EventStatus = "upcoming" | "completed";

export type Event = {
    id: string;
    title: string;
    description?: string | null | undefined;
    date: string;
    location: string;
    type: EventType;
    status: EventStatus;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
};

export type EventItem = Event & {
    tags: TagItem[];
    rsvp: Record<RsvpStatus, number>;
};

export type EventListItem = Event & {
    tags: TagItem[];
    rsvp: Record<RsvpStatus, number>;
    myRsvp?: RsvpStatus;
};

export type EventWithTagIds = Event & {
    tags: string[];
};
