import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SpaceMembersListDto {
  @ApiProperty({
    description: 'Список пользователей для добавления в пространство',
    minItems: 1,
  })
  @IsUUID(4, { each: true })
  members: string[];
}
