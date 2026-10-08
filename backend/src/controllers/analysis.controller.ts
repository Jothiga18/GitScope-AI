import { FastifyRequest } from 'fastify';
import { ok } from '../utils/response';
import { getReport } from '../services/report/report.service';
import { analysisRequestSchema } from '../schemas/analysis.schema';
import { usernameSchema } from '../validators/github.validator';
export const analyze = async (req: FastifyRequest) => ok(await getReport(analysisRequestSchema.parse(req.body).username));
export const report = async (req: FastifyRequest) => ok(await getReport(usernameSchema.parse((req.params as any).username)));
