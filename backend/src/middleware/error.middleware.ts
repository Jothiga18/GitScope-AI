import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError, fail } from '../utils/response';
export function errorHandler(err: any, req: FastifyRequest, reply: FastifyReply) {
  let status = 500, code = 'INTERNAL_ERROR', message = 'Something went wrong on our side. Try again shortly.';
  if (err instanceof ZodError) { status = 400; code = 'INVALID_INPUT'; message = err.issues[0]?.message || 'Invalid request.'; }
  else if (err instanceof AppError) { status = err.status; code = err.code; message = err.message; }
  else if (err?.statusCode === 429) { status = 429; code = 'RATE_LIMITED'; message = 'Too many requests. Try again in a minute.'; }
  else if (err?.statusCode >= 400 && err?.statusCode < 500) { status = err.statusCode; code = 'INVALID_INPUT'; message = 'Malformed request.'; }
  else req.log.error({ msg: err?.message }, 'unhandled error'); // message only: no stack or body is logged or returned
  reply.status(status).send(fail(code, message));
}
