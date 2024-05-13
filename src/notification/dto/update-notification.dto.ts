import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Уведомление просмотрено. По умолчанию true',
  })
  @IsBoolean()
  @IsOptional()
  isViewed?: boolean;
}
