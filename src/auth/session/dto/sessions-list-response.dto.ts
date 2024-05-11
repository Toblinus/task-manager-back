import { ApiProperty } from '@nestjs/swagger';
import { SessionResponseDto } from './session-response.dto';
import { UserSession } from '@prisma/client';

export class SessionsListResponseDto {
  @ApiProperty({ description: 'Список сессий', type: [SessionResponseDto] })
  sessions: SessionResponseDto[];

  constructor(sessions: UserSession[]) {
    this.sessions = sessions.map((session) => new SessionResponseDto(session));
  }
}
