import { buildApp } from './app';
import { env } from './config/env';
buildApp().then((app) => app.listen({ port: env.PORT, host: '0.0.0.0' })).catch((e) => { console.error(e); process.exit(1); });
