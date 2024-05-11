import { ApiProperty } from '@nestjs/swagger';
import {
  TaskStatusResponseDto,
  TaskStatusResponseDtoResource,
} from './task-status-response.dto';

export class TaskStatusesListResponseDto {
  @ApiProperty({
    description: 'Список столбцов',
    type: [TaskStatusResponseDto],
  })
  columns: TaskStatusResponseDto[];

  constructor(columns: TaskStatusResponseDtoResource[]) {
    this.columns = columns.map((column) => new TaskStatusResponseDto(column));
  }
}
