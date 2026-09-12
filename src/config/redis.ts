import { Redis } from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
    logger.info("Redis connection established");
});

redis.on("ready", () => {
    logger.info("Redis client ready");
});

redis.on("error", (error) => {
    logger.error(
        {
            service: "redis",
            error: error.message,
            code: "code" in error ? error.code : undefined,
        },
        "Redis connection error",
    );
});

redis.on("close", () => {
    logger.warn("Redis connection closed");
});

redis.on("reconnecting", (delay: number) => {
    logger.warn(
        {
            service: "redis",
            delay,
        },
        "Redis reconnecting",
    );
});
