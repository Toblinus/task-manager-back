import { ApiProperty } from '@nestjs/swagger';
import { UserAgentDto } from './user-agent.dto';
import { UserSession } from '@prisma/client';

export class SessionResponseDto {
  @ApiProperty({ description: 'UUID сессии' })
  id: string;

  @ApiProperty({ description: 'UUID пользователя' })
  userId: string;

  @ApiProperty({
    description: 'Данные из заголовка user-agent, к которым привязана сессия',
    type: UserAgentDto,
  })
  userAgent: UserAgentDto;

  @ApiProperty({
    description: 'Дата создания сессии',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего использования (обновления) сессии',
  })
  usedAt: Date;

  constructor(session: UserSession) {
    this.id = session.id;
    this.userAgent = new UserAgentDto(session.userAgent);
    this.userId = session.userId;
    this.usedAt = session.usedAt;
    this.createdAt = session.createdAt;
  }
}
