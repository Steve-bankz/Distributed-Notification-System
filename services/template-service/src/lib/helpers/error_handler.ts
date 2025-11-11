import type { FastifyReply, FastifyRequest } from "fastify";

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

const errorHandler = (
  error: unknown,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const err = error as AppError;

  reply.status(err.statusCode ?? 500).send({
    success: false,
    message: err.isOperational
      ? err.message ?? "Internal Server Error"
      : "Internal Server Error",
    error: err.isOperational ? "Fail" : "InternalServerError",
  });
};

export default errorHandler;
