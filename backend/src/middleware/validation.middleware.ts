import { FastifyInstance } from 'fastify';
/** Rejects non-JSON POST bodies; field-level validation lives in the zod schemas. */
export const registerValidation = (app: FastifyInstance) => app.addHook('preValidation', async (req, reply) => {
  if (req.method === 'POST' && !String(req.headers['content-type'] || '').includes('application/json'))
    return reply.status(415).send({ success: false, error: { code: 'INVALID_INPUT', message: 'Send JSON with Content-Type: application/json.' } });
});
