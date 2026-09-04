import * as eventRespository from "../repositories/event.repository.js";
import type { Event } from "../types/event.js";
import type { CreateEventInput } from "../validations/event.validation.js";

export async function getAll(userId: string): Promise<Event[]> {
    return eventRespository.getAll(userId);
}

export async function create(body: CreateEventInput, userId: string): Promise<Event> {
    return eventRespository.create(body, userId);
}
