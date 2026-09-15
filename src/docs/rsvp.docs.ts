import { registry } from "@/config/swagger.js";
import {
    adminErrorResponseSchema,
    authErrorResponseSchema,
    errorResponseSchema,
    idParamRequestSchema,
    internalServerErrorResponseSchema,
    invalidQueryErrorResponseSchema,
    successResponseSchema,
    validationErrorResponseSchema,
} from "@/validations/request-response.validation.js";
import {
    createRSVPSchema,
    paginatedRSVPSchema,
    rsvpQuerySchema,
    rsvpSchema,
    updateRSVPSchema,
} from "@/validations/rsvp.validation.js";

// Get all rsvps of an event
registry.registerPath({
    method: "get",
    path: "/events/{id}/rsvps",
    tags: ["RSVPs"],
    summary: "Get event RSVPs",
    description:
        "Returns a paginated list of RSVPs for a specific event. Supports filtering by RSVP status, searching by user name or email, and sorting by creation or update time.",
    security: [
        {
            bearerAuth: [],
        },
    ],
    request: {
        params: idParamRequestSchema("Event ID"),
        query: rsvpQuerySchema,
    },
    responses: {
        200: {
            description: "RSVPs fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "All rsvps fetched successfully",
                        paginatedRSVPSchema,
                    ),
                },
            },
        },

        400: {
            description: "Invalid query parameters",
            content: {
                "application/json": {
                    schema: invalidQueryErrorResponseSchema,
                },
            },
        },

        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },

        403: {
            description: "Not authorized - need admin access",
            content: {
                "application/json": {
                    schema: adminErrorResponseSchema,
                },
            },
        },

        404: {
            description: "Event not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Event not found"),
                },
            },
        },

        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Get my rsvp
registry.registerPath({
    method: "get",
    path: "/events/{id}/rsvps/me",
    summary: "Get my RSVP for an event",
    description:
        "Returns the requesting user's RSVP for a given event, or null if they haven't RSVP'd.",
    tags: ["RSVPs"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Event ID"),
    },
    responses: {
        200: {
            description: "My RSVP fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "My rsvp fetched successfully",
                        rsvpSchema.nullable(),
                    ),
                },
            },
        },
        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Create rsvp
registry.registerPath({
    method: "post",
    path: "/events/{id}/rsvps",
    summary: "RSVP to an event",
    description:
        "Creates an RSVP for the requesting user on the given event. Fails if the user has already RSVP'd (use update to change status).",
    tags: ["RSVPs"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Event ID"),
        body: {
            content: {
                "application/json": {
                    schema: createRSVPSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "RSVP created successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("RSVP created successfully", rsvpSchema),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: validationErrorResponseSchema,
                },
            },
        },
        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },
        404: {
            description: "Event not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Event not found"),
                },
            },
        },
        409: {
            description: "Already RSVP'd to this event",
            content: {
                "application/json": {
                    schema: errorResponseSchema("You have already RSVP'd to this event"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});

// Update rsvp
registry.registerPath({
    method: "patch",
    path: "/events/{id}/rsvps",
    summary: "Update my RSVP for an event",
    description: "Updates the requesting user's RSVP status for the given event.",
    tags: ["RSVPs"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Event ID"),
        body: {
            content: {
                "application/json": {
                    schema: updateRSVPSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "RSVP updated successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("RSVP updated successfully", rsvpSchema),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: validationErrorResponseSchema,
                },
            },
        },
        401: {
            description: "Not authenticated - no token found",
            content: {
                "application/json": {
                    schema: authErrorResponseSchema,
                },
            },
        },
        404: {
            description: "RSVP not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("RSVP not found"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: internalServerErrorResponseSchema,
                },
            },
        },
    },
});
