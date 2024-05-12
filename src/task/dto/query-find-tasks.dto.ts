import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class QueryFindTasksDto {
  @ApiPropertyOptional({ description: 'UUID автора' })
  @IsUUID()
  @IsOptional()
  authorId?: string;

  @ApiPropertyOptional({ description: 'UUID исполнителя' })
  @IsUUID()
  @IsOptional()
  executorId?: string;

  @ApiPropertyOptional({ description: 'UUID пространства' })
  @IsUUID()
  @IsOptional()
  spaceId?: string;

  @ApiPropertyOptional({ description: 'UUID статуса' })
  @IsUUID()
  @IsOptional()
  statusId?: string;
}
