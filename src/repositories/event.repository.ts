import { db } from "../db/index.js";
import type { Event } from "../types/event.js";
import type { CreateEventInput, UpdateEventInput } from "../validations/event.validation.js";

export async function findAll(userId: string): Promise<Event[]> {
    return await db<Event>("events").select("*").where("userId", userId);
}

export async function findById(eventId: string): Promise<Event | undefined> {
    const [event] = await db<Event>("events").select("*").where("id", eventId);

    return event;
}

export async function findByEventAndUser(
    eventId: string,
    userId: string,
): Promise<Event | undefined> {
    const [event] = await db<Event>("events")
        .select("*")
        .where("id", eventId)
        .where("userId", userId);

    return event;
}

export async function create(body: CreateEventInput, userId: string): Promise<Event> {
    const [event] = await db<Event>("events")
        .insert({ ...body, userId })
        .returning("*");

    return event as Event;
}

export async function update(
    eventId: string,
    body: UpdateEventInput,
    userId: string,
): Promise<Event | undefined> {
    const updateData = Object.fromEntries(
        Object.entries(body).filter(([, value]) => value !== undefined),
    );

    const [event] = await db<Event>("events")
        .where({ id: eventId, userId })
        .update({ ...updateData, updatedAt: new Date() })
        .returning("*");

    return event;
}
