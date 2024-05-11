import { ApiProperty } from '@nestjs/swagger';
import { ColumnSpace, Space } from '@prisma/client';
import { SpaceResponseDto } from 'src/space/dto/space-response.dto';

export type ColumnResponseDtoResource = ColumnSpace & { space: Space };

export class ColumnResponseDto {
  @ApiProperty({ description: 'UUID столбца' })
  id: string;
  @ApiProperty({ description: 'Название столбца' })
  name: string;
  @ApiProperty({ description: 'UUID пространства', type: SpaceResponseDto })
  space: SpaceResponseDto;

  constructor(column: ColumnResponseDtoResource) {
    this.id = column.id;
    this.name = column.name;
    this.space = new SpaceResponseDto(column.space);
  }
}
