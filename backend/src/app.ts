import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env';
import { API_PREFIX } from './config/constants';
import { loggerOptions } from './utils/logger';
import { ok } from './utils/response';
import { errorHandler } from './middleware/error.middleware';
import { registerRateLimit } from './middleware/rate-limit.middleware';
import { registerValidation } from './middleware/validation.middleware';
import analysisRoutes from './routes/analysis.routes';
import githubRoutes from './routes/github.routes';
import roastRoutes from './routes/roast.routes';
import comparisonRoutes from './routes/comparison.routes';
export async function buildApp() {
  const app = Fastify({ logger: loggerOptions as any, bodyLimit: 10_000 });
  await app.register(cors, { origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : [env.FRONTEND_URL, /^http:\/\/localhost:\d+$/], methods: ['GET', 'POST', 'OPTIONS'] });
  await registerRateLimit(app);
  registerValidation(app);
  app.setErrorHandler(errorHandler);
  app.setNotFoundHandler((_, reply) => reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
  await app.register(async (api) => {
    api.get('/health', async () => ok({ status: 'ok', aiConfigured: !!(env.GEMINI_API_KEY && env.GEMINI_MODEL), githubAuthenticated: !!env.GITHUB_TOKEN }));
    await api.register(githubRoutes); await api.register(analysisRoutes); await api.register(roastRoutes); await api.register(comparisonRoutes);
  }, { prefix: API_PREFIX });
  return app;
}
