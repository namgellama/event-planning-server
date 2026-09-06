import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./errors/error-handler.js";
import { notFound } from "./errors/not-found.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import tagRoutes from "./routes/tag.route.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/tags", tagRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
