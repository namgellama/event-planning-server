import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import "@/docs/index.js";

export const registry = new OpenAPIRegistry();

registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});
