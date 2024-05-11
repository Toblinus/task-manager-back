import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя для входа', required: false })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ description: 'Аватарка пользователя', required: false })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ description: 'Новый пароль пользователя', required: false })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description:
      'Старый пароль пользователя. Обязательно при указании нового пароля',
    required: false,
  })
  @ValidateIf((o: UpdateUserDto) => !!o.password)
  @IsString()
  oldPassword: string;
}
