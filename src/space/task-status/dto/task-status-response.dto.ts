import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  ColumnResponseDto,
  ColumnResponseDtoResource,
} from 'src/space/column/dto/column-response.dto';

export type TaskStatusResponseDtoResource = TaskStatus & {
  column: ColumnResponseDtoResource;
};

export class TaskStatusResponseDto {
  @ApiProperty({ description: 'UUID статуса' })
  id: string;
  @ApiProperty({ description: 'Название статуса' })
  name: string;
  @ApiProperty({ description: 'Статус является завершающим' })
  isCompleted: boolean;
  @ApiProperty({ description: 'Столбец' })
  column: ColumnResponseDto;

  constructor(status: TaskStatusResponseDtoResource) {
    this.id = status.id;
    this.name = status.name;
    this.column = new ColumnResponseDto(status.column);
    this.isCompleted = status.isCompleted;
  }
}
