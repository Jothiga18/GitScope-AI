import { FastifyRequest } from 'fastify';
import { ok } from '../utils/response';
import { getFacts } from '../services/report/report.service';
import { generateRoast } from '../services/ai/gemini.service';
import { roastRequestSchema } from '../schemas/roast.schema';
export const roast = async (req: FastifyRequest) => {
  const { username, mode } = roastRequestSchema.parse(req.body);
  return ok({ roast: await generateRoast(await getFacts(username), mode), mode });
};
