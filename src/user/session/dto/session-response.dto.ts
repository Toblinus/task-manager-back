import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({ description: 'UUID сессии' })
  id: string;

  @ApiProperty({ description: 'UUID пользователя' })
  userId: string;

  @ApiProperty({
    description: 'Данные из заголовка user-agent, к которым привязана сессия',
  })
  userAgent: string;

  @ApiProperty({
    description: 'Дата создания сессии',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего использования (обновления) сессии',
  })
  usedAt: Date;
}
