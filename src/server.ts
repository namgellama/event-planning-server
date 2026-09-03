import app from "./app.js";
import dotenv from "dotenv";
import { logger } from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT;
const ENVIRONMENT = process.env.NODE_ENV;

const start = async () => {
    try {
        app.listen(PORT);
        logger.info({ port: PORT, environment: ENVIRONMENT }, "Server started");
    } catch (error) {
        logger.fatal(
            { error: error instanceof Error ? error.message : error },
            "Application startup failed",
        );
        process.exit(1);
    }
};

start();
