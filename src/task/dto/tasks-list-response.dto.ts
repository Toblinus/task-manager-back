import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto, TaskResponseDtoResource } from './task-response.dto';

export class TasksListResponseDto {
  @ApiProperty({ description: 'Список задач', type: [TaskResponseDto] })
  tasks: TaskResponseDto[];

  constructor(tasks: TaskResponseDtoResource[]) {
    this.tasks = tasks.map((task) => new TaskResponseDto(task));
  }
}
