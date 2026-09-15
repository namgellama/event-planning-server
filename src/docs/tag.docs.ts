import { registry } from "@/config/swagger.js";
import {
    errorResponseSchema,
    idParamRequestSchema,
    successResponseSchema,
} from "@/validations/request-response.validation.js";
import {
    createTagSchema,
    paginatedTagsSchema,
    tagQuerySchema,
    tagSchema,
    updateTagSchema,
} from "@/validations/tag.validation.js";

// Fetch all tags
registry.registerPath({
    method: "get",
    path: "/tags",
    summary: "Fetch all tags",
    description: "Returns a paginated, searchable, sortable list of tags.",
    tags: ["Tags"],
    security: [{ bearerAuth: [] }],
    request: {
        query: tagQuerySchema,
    },
    responses: {
        200: {
            description: "All tags fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema(
                        "All tags fetched successfully",
                        paginatedTagsSchema,
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

// Fetch tag
registry.registerPath({
    method: "get",
    path: "/tags/{id}",
    summary: "Get a single tag by ID",
    description: "Returns full details for a single tag.",
    tags: ["Tags"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Tag ID"),
    },
    responses: {
        200: {
            description: "Tag fetched successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Tag fetched successfully", tagSchema),
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
            description: "Tag not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Tag not found"),
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

// Create tag
registry.registerPath({
    method: "post",
    path: "/tags",
    summary: "Create a new tag",
    description: "Creates a new tag owned by the requesting admin.",
    tags: ["Tags"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: createTagSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Tag created successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Tag created successfully", tagSchema),
                },
            },
        },
        400: {
            description: "Validation error",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Title is required"),
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

// Update tag
registry.registerPath({
    method: "patch",
    path: "/tags/{id}",
    summary: "Update a tag",
    description: "Updates a tag's title. Admin-only.",
    tags: ["Tags"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Tag ID"),
        body: {
            content: {
                "application/json": {
                    schema: updateTagSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Tag updated successfully",
            content: {
                "application/json": {
                    schema: successResponseSchema("Tag updated successfully", tagSchema),
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
            description: "Tag not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Tag not found"),
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

// Delete tag
registry.registerPath({
    method: "delete",
    path: "/tags/{id}",
    summary: "Delete a tag",
    description:
        "Permanently deletes a tag owned by the requesting admin. Returns no response body.",
    tags: ["Tags"],
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamRequestSchema("Tag ID"),
    },
    responses: {
        204: {
            description: "Tag deleted successfully — no response body",
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
            description: "Tag not found",
            content: {
                "application/json": {
                    schema: errorResponseSchema("Tag not found"),
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
