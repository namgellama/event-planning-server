import * as tagRepository from "../repositories/tag.repository.js";
import type { CreateTagInput } from "../validations/tag.validation.js";

export async function getAll(userId: string) {
    return tagRepository.getAll(userId);
}

export async function create(body: CreateTagInput, userId: string) {
    return tagRepository.create(body, userId);
}
