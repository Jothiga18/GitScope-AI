import { FastifyRequest } from 'fastify';
import { ok } from '../utils/response';
import { compareProfiles } from '../services/report/report.service';
import { compareRequestSchema } from '../schemas/analysis.schema';
export const compare = async (req: FastifyRequest) => { const { first, second } = compareRequestSchema.parse(req.body); return ok(await compareProfiles(first, second)); };
