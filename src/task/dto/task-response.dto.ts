import { ApiProperty } from '@nestjs/swagger';
import { Space, Task, User } from '@prisma/client';
import { SpaceResponseDto } from 'src/space/dto/space-response.dto';
import {
  TaskStatusResponseDto,
  TaskStatusResponseDtoResource,
} from 'src/space/task-status/dto/task-status-response.dto';
import { UserResonseDto } from 'src/user/dto/user-response.dto';

export type TaskResponseDtoResource = Task & {
  status: TaskStatusResponseDtoResource;
  space: Space;
  author: User;
  executor: User;
};

export class TaskResponseDto {
  @ApiProperty({ description: 'UUID задачи' })
  id: string;

  @ApiProperty({ description: 'Пространство задачи', type: SpaceResponseDto })
  space: SpaceResponseDto;

  @ApiProperty({ description: 'Автор задачи', type: UserResonseDto })
  author: UserResonseDto;

  @ApiProperty({ description: 'Исполнитель задачи', type: UserResonseDto })
  executor: UserResonseDto;

  @ApiProperty({ description: 'Статус задачи', type: TaskStatusResponseDto })
  status: TaskStatusResponseDto;

  @ApiProperty({ description: 'Заголовок задачи' })
  title: string;

  @ApiProperty({ description: 'Описание задачи' })
  description: string;

  @ApiProperty({ description: 'Дата создания задачи' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления задачи' })
  updatedAt: Date | null;

  @ApiProperty({ description: 'Дата исполнения задачи' })
  executionAt: Date;

  constructor(task: TaskResponseDtoResource) {
    this.id = task.id;
    this.space = new SpaceResponseDto(task.space);
    this.author = new UserResonseDto(task.author);
    this.executor = new UserResonseDto(task.executor);
    this.status = new TaskStatusResponseDto(task.status);
    this.title = task.title;
    this.description = task.description;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.executionAt = task.executionAt;
  }
}
