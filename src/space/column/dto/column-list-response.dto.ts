import { ApiProperty } from '@nestjs/swagger';
import {
  ColumnResponseDto,
  ColumnResponseDtoResource,
} from './column-response.dto';

export class ColumnListResponseDto {
  @ApiProperty({ description: 'Список столбцов', type: [ColumnResponseDto] })
  columns: ColumnResponseDto[];

  constructor(columns: ColumnResponseDtoResource[]) {
    this.columns = columns.map((column) => new ColumnResponseDto(column));
  }
}
