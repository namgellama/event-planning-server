import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

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
