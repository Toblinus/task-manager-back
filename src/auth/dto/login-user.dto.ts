import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Имя пользователя, используемое для входа',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Пароль пользователя',
  })
  @IsString()
  password: string;
}
