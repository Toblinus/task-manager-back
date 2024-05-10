import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserTokensResponseDto {
  @ApiProperty({
    description: 'Токен доступа',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'Токен обновления сессии',
  })
  @IsString()
  refreshToken: string;
}
