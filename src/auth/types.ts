import type { UserSession } from '@prisma/client';
import type { UserWithoutPassword } from 'src/user/types';

export type UserWithSession = UserWithoutPassword & { session: UserSession };

declare module 'express' {
  // Inject additional properties on express.Request
  interface Request {
    user: UserWithSession;
  }
}
