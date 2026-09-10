import { AppError } from "../errors/app-error.js";
import * as tagRepository from "../repositories/tag.repository.js";
import type { PaginatedResponse } from "../types/pagination.js";
import type { Tag } from "../types/tag.js";
import type { CreateTagInput, TagQuery } from "../validations/tag.validation.js";

export async function getAll(query: TagQuery): Promise<PaginatedResponse<Tag>> {
    const { page, limit } = query;

    const { tags, total } = await tagRepository.findAll(query);

    return {
        items: tags,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getById(tagId: string): Promise<Tag> {
    const tag = await tagRepository.findById(tagId);

    if (!tag) {
        throw new AppError(404, "Tag not found");
    }

    return tag;
}

export async function getByIds(tagIds: string[]): Promise<Tag[]> {
    return tagRepository.findByIds(tagIds);
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
