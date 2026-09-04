import { AppError } from "../errors/app-error.js";
import * as tagRepository from "../repositories/tag.repository.js";
import type { Tag } from "../types/tag.js";
import type { CreateTagInput } from "../validations/tag.validation.js";

export async function getAll(userId: string): Promise<Tag[]> {
    return tagRepository.findAll(userId);
}

export async function getById(tagId: string, userId: string): Promise<Tag> {
    const tag = await tagRepository.findByTagAndUser(tagId, userId);

    if (!tag) {
        throw new AppError(404, "Tag not found");
    }

    return tag;
}

export async function create(body: CreateTagInput, userId: string): Promise<Tag> {
    return tagRepository.create(body, userId);
}

export async function update(tagId: string, body: CreateTagInput, userId: string): Promise<Tag> {
    const tag = await tagRepository.update(tagId, body, userId);

    if (!tag) {
        throw new AppError(404, "Tag not found");
    }
    return tag;
}

export async function remove(tagId: string, userId: string): Promise<void> {
    const tag = await tagRepository.remove(tagId, userId);

    if (tag === 0) {
        throw new AppError(404, "Tag not found");
    }
}
