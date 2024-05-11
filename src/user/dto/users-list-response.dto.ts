import { ApiProperty } from '@nestjs/swagger';
import { UserResonseDto } from './user-response.dto';
import { UserWithoutPassword } from '../types';

export class UsersListResponseDto {
  @ApiProperty({ description: 'Список пользователей', type: [UserResonseDto] })
  public readonly users: UserResonseDto[];

  constructor(from: UserWithoutPassword[]) {
    this.users = from.map((user) => new UserResonseDto(user));
  }
}
