import express, { type Request, type Response } from "express";
import { errorHandler } from "./errors/error-handler.js";
import { notFound } from "./errors/not-found.js";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use(notFound);
app.use(errorHandler);

export default app;
