import cors from "cors";
import express, { type Request, type Response } from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./errors/error-handler.js";
import { notFound } from "./errors/not-found.js";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use(notFound);
app.use(errorHandler);

export default app;
