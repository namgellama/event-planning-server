import knex from "knex";
import { env } from "../config/env.js";
import { Pool } from "pg";
import { logger } from "../config/logger.js";

const pool = new Pool({
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
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
    connection: {
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
    },
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
