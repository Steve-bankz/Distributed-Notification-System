export const envSchema = {
  type: "object",
  required: ["PORT", "DB_URL", "NODE_ENV"],
  properties: {
    PORT: { type: "number", default: 3001 },
    DB_URL: { type: "string" },
    NODE_ENV: { type: "string", default: "development" },
  },
};
