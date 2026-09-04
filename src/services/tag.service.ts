import { AppError } from "../errors/app-error.js";
import * as tagRepository from "../repositories/tag.repository.js";
import type { CreateTagInput } from "../validations/tag.validation.js";

export async function getAll(userId: string) {
    return tagRepository.findAll(userId);
}

export async function getById(tagId: string, userId: string) {
    const tag = await tagRepository.findByTagAndUser(tagId, userId);

    if (!tag) {
        throw new AppError(404, "Tag not found");
    }

    return tag;
}

export async function create(body: CreateTagInput, userId: string) {
    return tagRepository.create(body, userId);
}
