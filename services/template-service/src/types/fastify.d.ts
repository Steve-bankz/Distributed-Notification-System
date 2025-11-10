import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      DB_URL: string;
      NODE_ENV: "development" | "production";
    };
  }
}
