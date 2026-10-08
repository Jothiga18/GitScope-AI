import { FastifyRequest } from 'fastify';
import { ok } from '../utils/response';
import { getProfile, getRepositories } from '../services/github/github.service';
import { usernameSchema } from '../validators/github.validator';
export const profile = async (req: FastifyRequest) => ok(await getProfile(usernameSchema.parse((req.params as any).username)));
export const repositories = async (req: FastifyRequest) => ok(await getRepositories(usernameSchema.parse((req.params as any).username)));
