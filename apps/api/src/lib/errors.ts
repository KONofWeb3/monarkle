import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

function isDbWakingUp(err: unknown): boolean {
  // Neon's free tier suspends its compute after idling and takes a couple
  // seconds to wake on the next connection. Prisma surfaces this as either a
  // PrismaClientKnownRequestError with code P1001 (an established client's
  // connection times out mid-request) or a PrismaClientInitializationError
  // (the client's very first connection attempt fails, e.g. right after this
  // dev server restarts) — both share the same "Can't reach database server"
  // message, so match on that rather than one specific error shape.
  if (!(err instanceof Error)) return false;
  if ('code' in err && (err as { code?: unknown }).code === 'P1001') return true;
  return err.message.includes("Can't reach database server");
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Wrap async route handlers so thrown errors reach errorHandler instead of crashing the process.
// Also retries once on a Neon cold-start so the first request of the day doesn't just 500.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (isDbWakingUp(err)) {
        try {
          await sleep(2000);
          await fn(req, res, next);
          return;
        } catch (retryErr) {
          return next(retryErr);
        }
      }
      next(err);
    }
  };
}
