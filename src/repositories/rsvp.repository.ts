import { db } from "../db/index.js";
import type { Rsvp, RsvpListItem } from "../types/rsvp.js";
import type { CreateRsvpInput, RsvpQuery } from "../validations/rsvp.validation.js";

export async function findAll(
    query: RsvpQuery,
    eventId: string,
): Promise<{ rsvps: RsvpListItem[]; total: number }> {
    const { page, limit, status, sortBy, sortOrder, search } = query;

    const offset = (page - 1) * limit;

    const sortColumn = {
        createdAt: "rsvps.createdAt",
        updatedAt: "rsvps.updatedAt",
    }[sortBy];

    const baseQuery = db<Rsvp>("rsvps")
        .join("users", "users.id", "rsvps.user_id")
        .where("rsvps.event_id", eventId)
        .modify((query) => {
            if (status) {
                query.where("rsvps.status", status);
            }

            if (search?.trim()) {
                const searchTerm = `%${search.trim()}%`;

                query.where((builder) => {
                    builder
                        .whereILike("users.name", searchTerm)
                        .orWhereILike("users.email", searchTerm);
                });
            }
        });

    const [rsvps, countResult] = await Promise.all([
        baseQuery
            .clone()
            .select(
                "rsvps.*",
                db.raw(`
               JSON_BUILD_OBJECT(
                'id', users.id,
                'name', users.name,
                'email', users.email
               ) as user
            `),
            )
            .orderBy(sortColumn, sortOrder)
            .limit(limit)
            .offset(offset),

        baseQuery.clone().count<{ count: string }>("rsvps.user_id").first(),
    ]);

    return {
        rsvps,
        total: Number(countResult?.count ?? 0),
    };
}

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

export async function update(
    body: CreateRsvpInput,
    eventId: string,
    userId: string,
): Promise<Rsvp | undefined> {
    const [rsvp] = await db<Rsvp>("rsvps")
        .where({ eventId, userId })
        .update({
            ...body,
            updatedAt: new Date(),
        })
        .returning("*");

    return rsvp;
}
