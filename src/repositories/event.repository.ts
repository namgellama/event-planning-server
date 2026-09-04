import { db } from "../db/index.js";
import type { Event } from "../types/event.js";
import type { CreateEventInput } from "../validations/event.validation.js";

export async function create(body: CreateEventInput, userId: string): Promise<Event> {
    const [event] = await db<Event>("events")
        .insert({ ...body, user_id: userId })
        .returning([
            "id",
            "title",
            "description",
            "date",
            "location",
            "visibility",
            "created_at as createdAt",
            "updated_at as updatedAt",
            "user_id as userId",
        ]);

    return event as Event;
}
