import { db } from "../db/index.js";
import type { Tag } from "../types/tag.js";
import type { CreateTagInput } from "../validations/tag.validation.js";

export async function getAll(userId: string): Promise<Tag[]> {
    return await db<Tag>("tags").select("*").where("userId", userId);
}

export async function create(body: CreateTagInput, userId: string): Promise<Tag> {
    const [tag] = await db<Tag>("tags")
        .insert({ ...body, userId })
        .returning("*");

    return tag!;
}
