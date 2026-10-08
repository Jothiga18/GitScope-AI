import { env } from '../config/env';
/** Structured pino logging via Fastify. debug in development, info in production; secrets are redacted. */
export const loggerOptions = env.NODE_ENV === 'test' ? false : {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: ['req.headers.authorization', 'req.headers.cookie', 'req.headers["x-goog-api-key"]'],
};
