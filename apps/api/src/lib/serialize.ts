import type { User } from '@prisma/client';

export function serializeUser(user: User) {
  const { passwordHash, ...safe } = user;
  return safe;
}
