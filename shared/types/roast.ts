import { ROAST_MODES } from '../constants';
export type RoastMode = (typeof ROAST_MODES)[number];
export interface RoastResponse { roast: string; mode: RoastMode }
