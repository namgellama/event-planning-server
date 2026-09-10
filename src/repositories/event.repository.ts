import type { Knex } from "knex";
import { db } from "../db/index.js";
import type { Event, EventTag } from "../types/event.js";
import type {
    CreateEventInput,
    EventQuery,
    UpdateEventInput,
} from "../validations/event.validation.js";

export async function findAll(
    userId: string,
    query: EventQuery,
): Promise<{ events: Event[]; total: number }> {
    const { page, limit, type, tags, search, sortBy, sortOrder } = query;

    const offset = (page - 1) * limit;

    const sortColumn = {
        date: "events.date",
        createdAt: "events.createdAt",
        title: "events.title",
    }[sortBy];

    const baseQuery = db<Event>("events")
        .where("events.userId", userId)
        .modify((query) => {
            if (type) {
                query.where("type", type);
            }

            if (search?.trim()) {
                const searchTerm = `%${search.trim()}%`;

                query.where((builder) => {
                    builder
                        .whereILike("events.title", searchTerm)
                        .orWhereILike("events.description", searchTerm)
                        .orWhereILike("events.location", searchTerm);
                });
            }

            if (tags?.length) {
                query.whereExists(function () {
                    this.select(db.raw("1"))
                        .from("event_tags")
                        .whereRaw("event_tags.event_id = events.id")
                        .whereIn("event_tags.tag_id", tags);
                });
            }
        });

    const [events, countResult] = await Promise.all([
        baseQuery
            .clone()
            .select(
                "events.*",
                db.raw(`
                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', tags.id,
                                'title', tags.title
                            )
                        ) FILTER (WHERE tags.id IS NOT NULL),
                        '[]'
                    ) AS tags
                `),
            )
            .leftJoin("event_tags", "events.id", "event_tags.event_id")
            .leftJoin("tags", "event_tags.tag_id", "tags.id")
            .groupBy("events.id")
            .orderBy(sortColumn, sortOrder)
            .limit(limit)
            .offset(offset),

        baseQuery.clone().count<{ count: string }>("events.id").first(),
    ]);

    return {
        events,
        total: Number(countResult?.count ?? 0),
    };
}

export async function findById(eventId: string): Promise<Event | undefined> {
    return await db<Event>("events").select("*").where("id", eventId).first();
}

export async function findByEventAndUser(
    eventId: string,
    userId: string,
): Promise<Event | undefined> {
    return db<Event>("events")
        .select(
            "events.*",
            db.raw(`
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', tags.id,
                            'title', tags.title
                        )
                    ) FILTER (WHERE tags.id IS NOT NULL),
                    '[]'
                ) AS tags
            `),
        )
        .leftJoin("event_tags", "events.id", "event_tags.event_id")
        .leftJoin("tags", "event_tags.tag_id", "tags.id")
        .where("events.id", eventId)
        .where("events.user_id", userId)
        .groupBy("events.id")
        .first();
}

export async function create(
    body: Omit<CreateEventInput, "tags">,
    tags: string[] = [],
    userId: string,
): Promise<Omit<Event, "tags"> & { tags: string[] }> {
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
): Promise<(Omit<Event, "tags"> & { tags: string[] }) | undefined> {
    return db.transaction(async (tx: Knex.Transaction) => {
        const { tags, ...eventData } = body;

        const updateData = Object.fromEntries(
            Object.entries(eventData).filter(([, value]) => value !== undefined),
        );

        const [event] = await tx<Event>("events")
            .where({
                id: eventId,
                userId,
            })
            .update({
                ...updateData,
                updatedAt: new Date(),
            })
            .returning("*");

        if (!event) {
            return undefined;
        }

        if (tags !== undefined) {
            await tx("event_tags").where("event_id", eventId).delete();

            if (tags.length > 0) {
                await tx("event_tags").insert(
                    tags.map((tagId) => ({
                        eventId,
                        tagId,
                    })),
                );
            }
        }

        const updatedEvent = await tx<Event>("events")
            .select(
                "events.*",
                tx.raw(`
                    COALESCE(
                        ARRAY_AGG(event_tags.tag_id)
                        FILTER (WHERE event_tags.tag_id IS NOT NULL),
                        '{}'
                    ) AS tags
                `),
            )
            .leftJoin("event_tags", "events.id", "event_tags.event_id")
            .where({
                "events.id": eventId,
                "events.userId": userId,
            })
            .groupBy("events.id")
            .first();

        return updatedEvent;
    });
}

export async function remove(eventId: string, userId: string): Promise<number> {
    return await db<Event>("events").where({ id: eventId, userId }).delete();
}
