import type { User } from "./user.js";

export type RSVPStatus = "yes" | "no" | "maybe";

export type RSVP = {
    eventId: string;
    userId: string;
    status: RSVPStatus;
    createdAt: Date;
    updatedAt: Date;
};

export type RSVPListItem = RSVP & {
    user: Pick<User, "id" | "name" | "email">;
};
