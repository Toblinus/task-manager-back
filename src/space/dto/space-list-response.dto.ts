import { ApiProperty } from '@nestjs/swagger';
import { SpaceResponseDto } from './space-response.dto';
import { Space } from '@prisma/client';

export class SpaceListResponse {
  @ApiProperty({ description: 'Список пространств', type: [SpaceResponseDto] })
  space: SpaceResponseDto[];

  constructor(space: Space[]) {
    this.space = space.map((item) => new SpaceResponseDto(item));
  }
}
