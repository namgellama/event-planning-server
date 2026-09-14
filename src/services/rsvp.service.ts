import { AppError } from "../errors/app-error.js";
import * as rsvpRepository from "../repositories/rsvp.repository.js";
import * as eventService from "../services/event.service.js";
import type { PaginatedResponse } from "../types/pagination.js";
import type { Rsvp, RsvpListItem } from "../types/rsvp.js";
import type { CreateRsvpInput, RsvpQuery } from "../validations/rsvp.validation.js";

export async function getAll(
    query: RsvpQuery,
    eventId: string,
): Promise<PaginatedResponse<RsvpListItem>> {
    await eventService.findById(eventId);

    const { page, limit } = query;

    const { rsvps, total } = await rsvpRepository.findAll(query, eventId);

    return {
        items: rsvps,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getByEventAndUser(eventId: string, userId: string): Promise<Rsvp | null> {
    const rsvp = await rsvpRepository.findByEventAndUser(eventId, userId);

    return rsvp ?? null;
}

export async function create(
    body: CreateRsvpInput,
    eventId: string,
    userId: string,
): Promise<Rsvp> {
    await eventService.findById(eventId);

    const rsvp = await rsvpRepository.findByEventAndUser(eventId, userId);

    if (rsvp) {
        throw new AppError(409, "You have already RSVP'd to this event");
    }

    return rsvpRepository.create(body, eventId, userId);
}

export async function update(
    body: CreateRsvpInput,
    eventId: string,
    userId: string,
): Promise<Rsvp> {
    const rsvp = await rsvpRepository.update(body, eventId, userId);

    if (!rsvp) {
        throw new AppError(404, "Rsvp not found");
    }

    return rsvp;
}
