import { AppError } from "../errors/app-error.js";
import * as rsvpRepository from "../repositories/rsvp.repository.js";
import * as eventService from "../services/event.service.js";
import type { Rsvp } from "../types/rsvp.js";
import type { CreateRsvpInput } from "../validations/rsvp.validation.js";

export async function create(
    body: CreateRsvpInput,
    eventId: string,
    userId: string,
): Promise<Rsvp> {
    await eventService.findById(eventId);

    const existing = await rsvpRepository.findByEventAndUser(eventId, userId);

    if (existing) {
        throw new AppError(409, "You have already RSVP'd to this event");
    }

    return rsvpRepository.create(body, eventId, userId);
}
