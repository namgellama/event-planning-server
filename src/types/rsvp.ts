export type RsvpStatus = "yes" | "no" | "maybe";

export type Rsvp = {
    eventId: string;
    userId: string;
    status: RsvpStatus;
    createdAt: Date;
    updatedAt: Date;
};
