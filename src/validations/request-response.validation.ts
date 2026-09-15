import z from "zod";
import { paginationSchema } from "./query.validation.js";

export const successResponseSchema = <T extends z.ZodType>(message: string, dataSchema: T) =>
    z.object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().openapi({
            example: message,
        }),
        data: dataSchema,
    });

export const errorResponseSchema = (message: string) =>
    z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: message }),
    });

export const invalidQueryErrorResponseSchema = errorResponseSchema("Invalid query paramters");
export const validationErrorResponseSchema = errorResponseSchema("Validation error");
export const authErrorResponseSchema = errorResponseSchema("Not authenticated - no token found");
export const adminErrorResponseSchema = errorResponseSchema("Not authorized - need admin access");
export const internalServerErrorResponseSchema = errorResponseSchema("Internal Server Error");

export const nullDataSchema = z.unknown().nullable().openapi({ example: null });

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
    z.object({
        items: z.array(itemSchema),
        pagination: paginationSchema,
    });

export const idParamRequestSchema = (description: string) =>
    z.object({
        id: z.string().openapi({
            example: "64f1c2e5a3b9d2f1a8e4c9d3",
            description: description,
        }),
    });
