import { ApiProperty } from '@nestjs/swagger';
import { SessionResponseDto } from './session-response.dto';

export class SessionsListResponseDto {
  @ApiProperty({ description: 'Список сессий', type: [SessionResponseDto] })
  sessions: SessionResponseDto[];
}
