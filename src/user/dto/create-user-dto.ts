import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя пользователя для входа' })
  username: string;
  @ApiProperty({ description: 'Пароль пользователя' })
  password: string;
}
