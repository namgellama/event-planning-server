import { registry } from "../config/swagger.js";
import {
    createEventSchema,
    eventItemSchema,
    eventQuerySchema,
    eventWithTagIdsSchema,
    paginatedEventsSchema,
    updateEventSchema,
} from "../validations/event.validation.js";
import {
    errorResponseSchema,
    idParamRequestSchema,
    successResponseSchema,
} from "../validations/request-response.validation.js";

// Fetch all events
registry.registerPath({
    method: "get",
    path: "/events",
    summary: "Fetch all events",
    description:
        "Returns a paginated, filterable list of events. Regular users only see events relevant to them; admins see all events.",
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    request: {
        query: eventQuerySchema,
    },
    responses: {
        200: {
            description: "All events fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "All events fetched successfully",
                        paginatedEventsSchema,
                    ),
                },
            },
        },
        400: {
            description: "Invalid query parameters",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Invalid request query"),
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

// Fetch event
registry.registerPath({
    method: "get",
    path: "/events/{id}",
    summary: "Fetch a single event by ID",
    description: "Returns full event details, including tags and RSVP counts by status.",
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Event ID"),
    },
    responses: {
        200: {
            description: "Event fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Event fetched successfully", eventItemSchema),
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

// Create event
registry.registerPath({
    method: "post",
    path: "/events",
    summary: "Create a new event",
    description: "Creates a new event with optional tags. Admin-only.",
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createEventSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Event created successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "Event created successfully",
                        eventWithTagIdsSchema,
                    ),
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
        403: {
            description: "Forbidden — admin only",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Forbidden"),
                },
            },
        },
        404: {
            description: "One or more tags not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("One or more tags not found"),
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

// Update event
registry.registerPath({
    method: "patch",
    path: "/events/{id}",
    summary: "Update an event",
    description: "Partially updates an event's fields. Admin-only.",
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Event ID"),
        body: {
            content: {
                "application/json": {
                    schema: updateEventSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Event updated successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "Event updated successfully",
                        eventWithTagIdsSchema,
                    ),
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
        403: {
            description: "Forbidden — admin only",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Forbidden"),
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

// Delete event
registry.registerPath({
    method: "delete",
    path: "/events/{id}",
    summary: "Delete an event",
    description: "Permanently deletes an event. Admin-only.",
    tags: ["Events"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Event ID"),
    },
    responses: {
        204: {
            description: "Event deleted successfully — no response body",
        },
        401: {
            description: "Unauthorized",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Unauthorized"),
                },
            },
        },
        403: {
            description: "Forbidden — admin only",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Forbidden"),
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
