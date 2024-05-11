import type { UserWithoutPassword } from 'src/user/types';
import { SessionResponseDto } from './session/dto/session-response.dto';

export type UserWithSession = UserWithoutPassword & {
  session: SessionResponseDto;
};

declare module 'express' {
  // Inject additional properties on express.Request
  interface Request {
    user: UserWithSession;
  }
}
