import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTaskStatusDto {
  @ApiProperty({ description: 'Название статуса' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'UUID столбца' })
  @IsString()
  @IsUUID()
  columnId: string;

  @ApiPropertyOptional({ description: 'Статус является завершающим' })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
