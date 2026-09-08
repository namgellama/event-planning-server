import { AppError } from "../errors/app-error.js";
import * as eventRespository from "../repositories/event.repository.js";
import type { Event } from "../types/event.js";
import type { PaginatedResponse } from "../types/pagination.js";
import type {
    CreateEventInput,
    EventQuery,
    UpdateEventInput,
} from "../validations/event.validation.js";
import * as tagService from "./tag.service.js";

export async function getAll(userId: string, query: EventQuery): Promise<PaginatedResponse<Event>> {
    const { page, limit, type, search } = query;

    const { events, total } = await eventRespository.findAll(userId, page, limit, type, search);

    return {
        items: events,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getById(eventId: string, userId: string): Promise<Event> {
    const event = await eventRespository.findByEventAndUser(eventId, userId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function create(
    body: CreateEventInput,
    userId: string,
): Promise<Omit<Event, "tags"> & { tags: string[] }> {
    const { tags = [], ...eventData } = body;

    if (tags.length > 0) {
        const existingTags = await tagService.getByIds(tags, userId);

        if (existingTags.length !== tags.length) {
            throw new AppError(404, "One or more tags not found");
        }
    }

    return eventRespository.create(eventData, tags, userId);
}

export async function update(
    eventId: string,
    body: UpdateEventInput,
    userId: string,
): Promise<Omit<Event, "tags"> & { tags: string[] }> {
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
