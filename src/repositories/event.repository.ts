import type { Knex } from "knex";
import { db } from "../db/index.js";
import type { Event, EventTag } from "../types/event.js";
import type { CreateEventInput, UpdateEventInput } from "../validations/event.validation.js";

export async function findAll(userId: string): Promise<Event[]> {
    return await db<Event>("events").select("*").where("userId", userId);
}

export async function findById(eventId: string): Promise<Event | undefined> {
    return await db<Event>("events").select("*").where("id", eventId).first();
}

export async function findByEventAndUser(
    eventId: string,
    userId: string,
): Promise<Event | undefined> {
    return await db<Event>("events")
        .select("*")
        .where("id", eventId)
        .where("userId", userId)
        .first();
}

export async function create(
    body: Omit<CreateEventInput, "tags">,
    tags: string[] = [],
    userId: string,
): Promise<Event> {
    return db.transaction(async (tx: Knex.Transaction) => {
        const [event] = await tx<Event>("events")
            .insert({ ...body, userId })
            .returning("*");

        if (tags.length > 0) {
            await tx<EventTag>("event_tags").insert(
                tags.map((tagId) => ({
                    eventId: event!.id,
                    tagId,
                })),
            );
        }

        return {
            ...event!,
            tags,
        };
    });
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

export async function remove(eventId: string, userId: string): Promise<number> {
    return await db<Event>("events").where({ id: eventId, userId }).delete();
}
