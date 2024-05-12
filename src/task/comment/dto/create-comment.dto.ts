import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Тело комментария' })
  @IsString()
  body: string;
}
