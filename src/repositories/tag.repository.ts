import { db } from "../db/index.js";
import type { Tag } from "../types/tag.js";
import type { CreateTagInput, TagQuery, UpdateTagInput } from "../validations/tag.validation.js";

export async function findAll(query: TagQuery): Promise<{ tags: Tag[]; total: number }> {
    const { page, limit, search, sortBy, sortOrder } = query;

    const offset = (page - 1) * limit;

    const sortColumn = {
        title: "title",
        createdAt: "createdAt",
    }[sortBy];

    const baseQuery = db<Tag>("tags").modify((query) => {
        if (search?.trim()) {
            const searchTerm = `%${search.trim()}%`;

            query.where((builder) => {
                builder.whereILike("title", searchTerm);
            });
        }
    });

    const [tags, countResult] = await Promise.all([
        baseQuery.clone().select("*").orderBy(sortColumn, sortOrder).limit(limit).offset(offset),

        baseQuery.clone().count<{ count: string }>("id").first(),
    ]);

    return {
        tags,
        total: Number(countResult?.count ?? 0),
    };
}

export async function findById(tagId: string): Promise<Tag | undefined> {
    return await db<Tag>("tags").select("*").where("id", tagId).first();
}

export async function findByIds(tagId: string[], userId: string): Promise<Tag[]> {
    return await db<Tag>("tags").select("*").whereIn("id", tagId).where("userId", userId);
}

export async function create(body: CreateTagInput, userId: string): Promise<Tag> {
    const [tag] = await db<Tag>("tags")
        .insert({ ...body, userId })
        .returning("*");

    return tag!;
}

export async function update(
    tagId: string,
    body: UpdateTagInput,
    userId: string,
): Promise<Tag | undefined> {
    const updateData = Object.fromEntries(
        Object.entries(body).filter(([, value]) => value != undefined),
    );

    const [tag] = await db<Tag>("tags")
        .where({ id: tagId, userId })
        .update({ ...updateData, updatedAt: new Date() })
        .returning("*");

    return tag;
}

export async function remove(tagId: string, userId: string): Promise<number> {
    return await db<Tag>("tags").where({ id: tagId, userId }).delete();
}
