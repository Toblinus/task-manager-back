import { ApiProperty } from '@nestjs/swagger';
import { Space } from '@prisma/client';

export class SpaceResponseDto {
  @ApiProperty({ description: 'UUID пространства' })
  readonly id: string;

  @ApiProperty({ description: 'Название пространства' })
  readonly name: string;

  @ApiProperty({
    description: 'UUID пользователя, который является владельцем пространства',
  })
  readonly ownerId: string;

  @ApiProperty({
    description:
      'UUID статуса задачи по умолчанию. Устанавливается в качестве статуса по умолчанию в каждую новую задачу',
  })
  readonly defaultTaskStatusId: string;

  constructor(space: Space) {
    this.id = space.id;
    this.name = space.name;
    this.ownerId = space.ownerId;
    this.defaultTaskStatusId = space.defaultTaskStatusId;
  }
}
