import { z } from "zod";

import "@/config/zod-extend.js";

export const userResponseSchema = z
    .object({
        id: z.string().openapi({ example: "64f1c2e5a3b9d2f1a8e4c9d3" }),
        name: z.string().openapi({ example: "Jane Doe" }),
        email: z.email().openapi({ example: "jane@example.com" }),
        role: z.enum(["user", "admin"]).openapi({ example: "user" }),
        createdAt: z.string().datetime().openapi({ example: "2026-09-13T10:00:00.000Z" }),
    })
    .openapi("UserResponse");
