import { z } from 'zod';
import { ROAST_MODES } from '../../../shared/constants';
import { usernameSchema } from '../validators/github.validator';
export const roastRequestSchema = z.object({ username: usernameSchema, mode: z.enum(ROAST_MODES).default('witty') });
export const roastAiSchema = z.object({ roast: z.string().min(20) });
