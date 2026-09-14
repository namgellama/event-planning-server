import type { User } from "./user.js";

export type RsvpStatus = "yes" | "no" | "maybe";

export type Rsvp = {
    eventId: string;
    userId: string;
    status: RsvpStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type RsvpListItem = Rsvp & {
    user: Pick<User, "id" | "name" | "email">;
};
