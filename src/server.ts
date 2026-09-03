import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { checkDB } from "./db/index.js";

const PORT = env.PORT;
const ENVIRONMENT = env.NODE_ENV;

const start = async () => {
    try {
        await checkDB();

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
