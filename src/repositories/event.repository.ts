import { db } from "../db/index.js";
import type { Event } from "../types/event.js";
import type { CreateEventInput } from "../validations/event.validation.js";

export async function getAll(userId: string): Promise<Event[]> {
    return await db<Event>("events").select("*").where("userId", userId);
}

export async function create(body: CreateEventInput, userId: string): Promise<Event> {
    const [event] = await db<Event>("events")
        .insert({ ...body, userId })
        .returning("*");

    return event as Event;
}
