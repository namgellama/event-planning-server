import { db } from "@/db/index.js";
import type { RSVP, RSVPListItem } from "@/types/rsvp.js";
import type { CreateRSVPInput, RSVPQuery } from "@/validations/rsvp.validation.js";

export async function findAll(
    query: RSVPQuery,
    eventId: string,
): Promise<{ rsvps: RSVPListItem[]; total: number }> {
    const { page, limit, status, sortBy, sortOrder, search } = query;

    const offset = (page - 1) * limit;

    const sortColumn = {
        createdAt: "rsvps.createdAt",
        updatedAt: "rsvps.updatedAt",
    }[sortBy];

    const baseQuery = db<RSVP>("rsvps")
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
): Promise<RSVP | undefined> {
    return await db<RSVP>("rsvps")
        .select("*")
        .where("eventId", eventId)
        .where("userId", userId)
        .first();
}

export async function create(
    body: CreateRSVPInput,
    eventId: string,
    userId: string,
): Promise<RSVP> {
    const [rsvp] = await db<RSVP>("rsvps")
        .insert({ ...body, eventId, userId })
        .returning("*");

    return rsvp!;
}

export async function update(
    body: CreateRSVPInput,
    eventId: string,
    userId: string,
): Promise<RSVP | undefined> {
    const [rsvp] = await db<RSVP>("rsvps")
        .where({ eventId, userId })
        .update({
            ...body,
            updatedAt: new Date(),
        })
        .returning("*");

    return rsvp;
}
