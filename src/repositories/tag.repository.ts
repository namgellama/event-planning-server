import { db } from "../db/index.js";
import type { Tag } from "../types/tag.js";
import type { CreateTagInput, UpdateTagInput } from "../validations/tag.validation.js";

export async function findAll(userId: string): Promise<Tag[]> {
    return await db<Tag>("tags").select("*").where("userId", userId);
}

export async function findById(tagId: string): Promise<Tag | undefined> {
    return await db<Tag>("tags").select("*").where("id", tagId).first();
}

export async function findByTagAndUser(tagId: string, userId: string): Promise<Tag | undefined> {
    return await db<Tag>("tags").select("*").where("id", tagId).where("userId", userId).first();
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
