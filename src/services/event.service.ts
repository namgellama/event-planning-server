import { AppError } from "@/errors/app-error.js";
import * as eventRespository from "@/repositories/event.repository.js";
import type { Event, EventItem, EventListItem, EventWithTagIds } from "@/types/event.js";
import type { PaginatedResponse } from "@/types/pagination.js";
import type { User } from "@/types/user.js";
import type {
    CreateEventInput,
    EventQuery,
    UpdateEventInput,
} from "@/validations/event.validation.js";
import * as tagService from "./tag.service.js";

export async function getAllEvents(
    query: EventQuery,
    user: Pick<User, "id" | "role">,
): Promise<PaginatedResponse<EventListItem>> {
    const { page, limit } = query;

    const { events, total } = await eventRespository.findAll(
        query,
        user.role === "user" ? user.id : undefined,
    );

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

export async function getEventDetailsById(eventId: string): Promise<EventItem> {
    const event = await eventRespository.findByIdWithDetails(eventId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function getEventById(eventId: string): Promise<Omit<Event, "tags">> {
    const event = await eventRespository.findById(eventId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function createEvent(
    body: CreateEventInput,
    userId: string,
): Promise<EventWithTagIds> {
    const { tags = [], ...eventData } = body;

    if (tags.length > 0) {
        const existingTags = await tagService.getTagsByIds(tags);

        if (existingTags.length !== tags.length) {
            throw new AppError(404, "One or more tags not found");
        }
    }

    return eventRespository.create(eventData, tags, userId);
}

export async function updateEvent(
    eventId: string,
    body: UpdateEventInput,
    userId: string,
): Promise<EventWithTagIds> {
    const event = await eventRespository.update(eventId, body, userId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function deleteEvent(eventId: string, userId: string): Promise<void> {
    const deleted = await eventRespository.remove(eventId, userId);

    if (deleted === 0) {
        throw new AppError(404, "Event not found");
    }
}
