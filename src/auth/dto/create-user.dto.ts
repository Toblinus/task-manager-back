import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description:
      'Имя пользователя, используемое для входа. Должно быть уникальным',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Пароль пользователя',
  })
  @IsString()
  password: string;
}
