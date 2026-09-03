import dotenv from "dotenv";
import type ms from "ms";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(8000),
    LOG_LEVEL: z
        .enum(["info", "error", "warn", "trace", "silent", "debug", "fatal"])
        .default("info"),
    FRONTEND_URL: z.string(),
    DATABASE_URL: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.coerce.number().int(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_ACCESS_EXPIRY: z.custom<ms.StringValue>(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRY: z.custom<ms.StringValue>(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(z.treeifyError(parsed.error).properties, null, 2));
    process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
