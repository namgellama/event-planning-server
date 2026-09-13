import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "../config/swagger.js";
import "./auth.docs.js";

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "Gather API",
        version: "1.0.0",
        description: "API documentation for Gather",
    },
    servers: [{ url: "/api/v1" }],
});
