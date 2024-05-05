import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserResonseDto {
  @ApiProperty({
    description: 'Название файла, содержащего изображение автарки пользователя',
  })
  public readonly avatar: string;

  @ApiProperty({
    type: 'string(uuid)',
    example: '8d3b2a40-83e7-42bf-8764-bd93fc3ede77',
    description: 'Уникальный id пользователя',
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Уникальный логин, используемый для входа',
  })
  public readonly username: string;

  constructor(from: User) {
    const { avatar, id, username } = from;

    this.avatar = avatar || 'default.png';
    this.id = id;
    this.username = username;
  }
}
