import { AppError } from "@/errors/app-error.js";
import * as rsvpRepository from "@/repositories/rsvp.repository.js";
import * as eventService from "@/services/event.service.js";
import type { PaginatedResponse } from "@/types/pagination.js";
import type { RSVP, RSVPListItem } from "@/types/rsvp.js";
import type { CreateRSVPInput, RSVPQuery } from "@/validations/rsvp.validation.js";

export async function getAllRSVPs(
    query: RSVPQuery,
    eventId: string,
): Promise<PaginatedResponse<RSVPListItem>> {
    await eventService.getEventById(eventId);

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

export async function getRSVPByEventAndUser(eventId: string, userId: string): Promise<RSVP | null> {
    const rsvp = await rsvpRepository.findByEventAndUser(eventId, userId);

    return rsvp ?? null;
}

export async function createRSVP(
    body: CreateRSVPInput,
    eventId: string,
    userId: string,
): Promise<RSVP> {
    await eventService.getEventById(eventId);

    const rsvp = await rsvpRepository.findByEventAndUser(eventId, userId);

    if (rsvp) {
        throw new AppError(409, "You have already RSVP'd to this event");
    }

    return rsvpRepository.create(body, eventId, userId);
}

export async function updateRSVP(
    body: CreateRSVPInput,
    eventId: string,
    userId: string,
): Promise<RSVP> {
    const rsvp = await rsvpRepository.update(body, eventId, userId);

    if (!rsvp) {
        throw new AppError(404, "RSVP not found");
    }

    return rsvp;
}
