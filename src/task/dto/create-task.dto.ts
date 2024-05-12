import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'UUID пространства' })
  @IsUUID()
  spaceId: string;

  @ApiProperty({ description: 'UUID исполнителя' })
  @IsUUID()
  executorId: string;

  @ApiPropertyOptional({
    description:
      'UUID статуса. Если не передано, то используется статус по умолчанию из пространства',
  })
  @IsUUID()
  @IsOptional()
  statusId?: string;

  @ApiProperty({ description: 'Заголовок задачи' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Описание задачи' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Дата исполнения' })
  @IsString()
  executionAt: string;
}
