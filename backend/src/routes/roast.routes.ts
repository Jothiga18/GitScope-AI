import { FastifyInstance } from 'fastify';
import { HEAVY_ROUTE_LIMIT } from '../config/constants';
import { roast } from '../controllers/roast.controller';
export default async (app: FastifyInstance) => { app.post('/roast', { config: { rateLimit: HEAVY_ROUTE_LIMIT } }, roast); };
