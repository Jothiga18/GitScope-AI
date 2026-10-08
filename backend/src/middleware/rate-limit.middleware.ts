import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';
export const registerRateLimit = (app: FastifyInstance) => app.register(rateLimit, { global: true, max: 90, timeWindow: '1 minute' });
