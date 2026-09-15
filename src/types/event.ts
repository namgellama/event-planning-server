import type { RSVPStatus } from "./rsvp.js";
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
    rsvp: Record<RSVPStatus, number>;
};

export type EventListItem = Event & {
    tags: TagItem[];
    rsvp: Record<RSVPStatus, number>;
    myRsvp?: RSVPStatus;
};

export type EventWithTagIds = Event & {
    tags: string[];
};
