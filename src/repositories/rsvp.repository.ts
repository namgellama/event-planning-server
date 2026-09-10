import { db } from "../db/index.js";
import type { Rsvp } from "../types/rsvp.js";
import type { CreateRsvpInput } from "../validations/rsvp.validation.js";

export async function findByEventAndUser(
    eventId: string,
    userId: string,
): Promise<Rsvp | undefined> {
    return await db<Rsvp>("rsvps")
        .select("*")
        .where("eventId", eventId)
        .where("userId", userId)
        .first();
}

export async function create(
    body: CreateRsvpInput,
    eventId: string,
    userId: string,
): Promise<Rsvp> {
    const [rsvp] = await db<Rsvp>("rsvps")
        .insert({ ...body, eventId, userId })
        .returning("*");

    return rsvp!;
}
