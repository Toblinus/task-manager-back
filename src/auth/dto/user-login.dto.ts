import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: 'Имя пользователя для входа',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Пароль пользователя',
  })
  @IsString()
  password: string;
}
