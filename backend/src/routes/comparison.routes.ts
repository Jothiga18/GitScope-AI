import { FastifyInstance } from 'fastify';
import { HEAVY_ROUTE_LIMIT } from '../config/constants';
import { compare } from '../controllers/comparison.controller';
export default async (app: FastifyInstance) => { app.post('/compare', { config: { rateLimit: HEAVY_ROUTE_LIMIT } }, compare); };
