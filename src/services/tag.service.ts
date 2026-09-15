import { AppError } from "@/errors/app-error.js";
import * as tagRepository from "@/repositories/tag.repository.js";
import type { PaginatedResponse } from "@/types/pagination.js";
import type { Tag } from "@/types/tag.js";
import type { CreateTagInput, TagQuery } from "@/validations/tag.validation.js";

export async function getAllTags(query: TagQuery): Promise<PaginatedResponse<Tag>> {
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

export async function getTagById(tagId: string): Promise<Tag> {
    const tag = await tagRepository.findById(tagId);

    if (!tag) {
        throw new AppError(404, "Tag not found");
    }

    return tag;
}

export async function getTagsByIds(tagIds: string[]): Promise<Tag[]> {
    return tagRepository.findByIds(tagIds);
}

export async function createTag(body: CreateTagInput, userId: string): Promise<Tag> {
    return tagRepository.create(body, userId);
}

export async function updateTag(tagId: string, body: CreateTagInput): Promise<Tag> {
    const tag = await tagRepository.update(tagId, body);

    if (!tag) {
        throw new AppError(404, "Tag not found");
    }
    return tag;
}

export async function deleteTag(tagId: string): Promise<void> {
    const tag = await tagRepository.remove(tagId);

    if (tag === 0) {
        throw new AppError(404, "Tag not found");
    }
}
