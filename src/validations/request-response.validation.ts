import z from "zod";

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

export const nullDataSchema = z.unknown().nullable().openapi({ example: null });
