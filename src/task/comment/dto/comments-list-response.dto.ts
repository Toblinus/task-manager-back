import { ApiProperty } from '@nestjs/swagger';
import {
  CommentResponseDto,
  CommentResponseDtoResource,
} from './comment-response.dto';

export class CommentsListResponseDto {
  @ApiProperty({ description: 'Список задач', type: [CommentResponseDto] })
  comments: CommentResponseDto[];

  constructor(comments: CommentResponseDtoResource[]) {
    this.comments = comments.map((comment) => new CommentResponseDto(comment));
  }
}
