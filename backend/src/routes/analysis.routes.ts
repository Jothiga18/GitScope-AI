import { FastifyInstance } from 'fastify';
import { HEAVY_ROUTE_LIMIT } from '../config/constants';
import { analyze, report } from '../controllers/analysis.controller';
export default async (app: FastifyInstance) => {
  app.post('/analysis', { config: { rateLimit: HEAVY_ROUTE_LIMIT } }, analyze);
  app.get('/report/:username', { config: { rateLimit: HEAVY_ROUTE_LIMIT } }, report);
};
