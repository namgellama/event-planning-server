import knex from "knex";
import { env } from "../config/env.js";
import { Pool } from "pg";
import { logger } from "../config/logger.js";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

pool.on("connect", () => {
    logger.info("PostgreSQL connection established");
});

pool.on("error", (error) => {
    logger.error(
        {
            service: "postgres",
            error: error.message,
        },
        "PostgreSQL pool error",
    );
});

export const db = knex({
    client: "pg",
    connectionPool: pool,
});

export async function checkDB() {
    try {
        const client = await pool.connect();

        client.release();

        logger.info("PostgreSQL database connected");
    } catch (error) {
        logger.fatal(
            {
                service: "postgres",
                error: error instanceof Error ? error.message : error,
            },
            "PostgreSQL database connection failed",
        );

        throw error;
    }
}
