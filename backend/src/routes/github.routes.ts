import { FastifyInstance } from 'fastify';
import { profile, repositories } from '../controllers/github.controller';
export default async (app: FastifyInstance) => {
  app.get('/github/profile/:username', profile);
  app.get('/github/repositories/:username', repositories);
};
