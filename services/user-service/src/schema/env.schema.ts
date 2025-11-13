const env_schema = {
  type: "object",
  required: [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "SERVICE_NAME",
    "CONSUL_HOST",
    "CONSUL_PORT",
    "JWT_SECRET",
  ],
  properties: {
    PORT: { type: "number", default: 3001 },
    DB_URL: { type: "string" },
    SERVICE_NAME: { type: "string", default: "user-service" },
    CONSUL_HOST: { type: "string", default: "localhost" },
    CONSUL_PORT: { type: "number", default: 8500 },
    NODE_ENV: { type: "string", default: "development" },
    JWT_SECRET: { type: "string" },
  },
}

export default env_schema
