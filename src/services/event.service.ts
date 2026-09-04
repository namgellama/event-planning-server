import { AppError } from "../errors/app-error.js";
import * as eventRespository from "../repositories/event.repository.js";
import type { Event } from "../types/event.js";
import type { CreateEventInput, UpdateEventInput } from "../validations/event.validation.js";

export async function getAll(userId: string): Promise<Event[]> {
    return eventRespository.findAll(userId);
}

export async function getById(eventId: string, userId: string): Promise<Event> {
    const event = await eventRespository.findByEventAndUser(eventId, userId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function create(body: CreateEventInput, userId: string): Promise<Event> {
    return eventRespository.create(body, userId);
}

export async function update(
    eventId: string,
    body: UpdateEventInput,
    userId: string,
): Promise<Event> {
    const event = await eventRespository.update(eventId, body, userId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function remove(eventId: string, userId: string): Promise<void> {
    const deleted = await eventRespository.remove(eventId, userId);

    if (deleted === 0) {
        throw new AppError(404, "Event not found");
    }
}
