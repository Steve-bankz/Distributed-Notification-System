import env from "@fastify/env";
import mysql from "@fastify/mysql";
import Fastify from "fastify";

import error_handler from "./lib/helpers/error_handler.js";
import { template_routes } from "./routes.js";
import { envSchema as schema } from "./schema.js";

const app = Fastify({ logger: true });

await app.register(env, {
  confKey: "config",
  schema,
  dotenv: true,
});

app.register(mysql, {
  promise: true,
  connectionString: app.config.DB_URL,
});

app.register(template_routes, { prefix: "/api/v1/templates" });

app.get("/health", async (_request, reply) => {
  reply.send({ status: "ok" });
});

app.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});

app.setErrorHandler(error_handler);

export default app;
