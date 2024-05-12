import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskComment, User } from '@prisma/client';
import {
  TaskResponseDto,
  TaskResponseDtoResource,
} from 'src/task/dto/task-response.dto';
import { UserResonseDto } from 'src/user/dto/user-response.dto';

export type CommentResponseDtoResource = TaskComment & {
  author: User;
  task: TaskResponseDtoResource;
};

export class CommentResponseDto {
  @ApiProperty({ description: 'UUID комментария' })
  id: string;

  @ApiProperty({ description: 'Автор комментария', type: UserResonseDto })
  author: UserResonseDto;

  @ApiProperty({ description: 'Комментируемая задача', type: TaskResponseDto })
  task: TaskResponseDto;

  @ApiProperty({ description: 'Дата создания комментария' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Дата обновления комментария' })
  updatedAt: Date;

  @ApiProperty({ description: 'Тело комментария' })
  body: string;

  constructor(comment: CommentResponseDtoResource) {
    this.id = comment.id;
    this.body = comment.body;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;

    this.author = new UserResonseDto(comment.author);
    this.task = new TaskResponseDto(comment.task);
  }
}
