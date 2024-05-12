import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'UUID исполнителя' })
  @IsUUID()
  @IsOptional()
  executorId: string;

  @ApiPropertyOptional({
    description: 'UUID статуса',
  })
  @IsUUID()
  @IsOptional()
  statusId?: string;

  @ApiPropertyOptional({ description: 'Заголовок задачи' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiPropertyOptional({ description: 'Описание задачи' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'Дата исполнения' })
  @IsString()
  @IsOptional()
  executionAt: string;
}
