export class ApiError extends Error {
  constructor(public code: string, message: string, public status: number) { super(message); }
}
const BASE =
  import.meta.env.VITE_API_URL ||
  'http://localhost:4000/api/v1';
/** Calls the GitScope backend and unwraps the { success, data | error } envelope. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try { res = await fetch(BASE + path, { cache: 'no-store', ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } }); }
  catch { throw new ApiError('NETWORK_ERROR', 'Could not reach the GitScope backend. Make sure it is running.', 0); }
  const j = await res.json().catch(() => null);
  if (!j?.success) throw new ApiError(j?.error?.code || 'INTERNAL_ERROR', j?.error?.message || 'Unexpected error.', res.status);
  return j.data as T;
}
