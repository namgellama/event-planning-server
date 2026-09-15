import { registry } from "@/config/swagger.js";
import {
    errorResponseSchema,
    idParamRequestSchema,
    successResponseSchema,
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
    tags: ["RSVP"],
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
                    schema: errorResponseSchema("Invalid query parameters"),
                },
            },
        },

        401: {
            description: "Unauthenticated",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Not authenticated"),
                },
            },
        },

        403: {
            description: "Forbidden - admin access required",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Forbiden - admin access required"),
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
                    schema: errorResponseSchema("Internal server error"),
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
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Unauthorized"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Internal server error"),
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
            description: "Rsvp created successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Rsvp created successfully", rsvpSchema),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid request body"),
                },
            },
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Unauthorized"),
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
                    schema: errorResponseSchema("Internal server error"),
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
            description: "Rsvp updated successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Rsvp updated successfully", rsvpSchema),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid request body"),
                },
            },
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Unauthorized"),
                },
            },
        },
        404: {
            description: "Rsvp not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Rsvp not found"),
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Internal server error"),
                },
            },
        },
    },
});
