export class AppError extends Error {
  constructor(public code: string, message: string, public status = 500) { super(message); }
}
export const ok = <T>(data: T) => ({ success: true as const, data });
export const fail = (code: string, message: string) => ({ success: false as const, error: { code, message } });
