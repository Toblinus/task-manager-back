import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Notification, NotificationType } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty({ description: 'UUID уведомления' })
  id: string;

  @ApiProperty({ description: 'Уведомление просмотрено' })
  isViewed: boolean;

  @ApiProperty({ description: 'Тип уведомления', enum: NotificationType })
  type: NotificationType;

  @ApiPropertyOptional()
  payload: unknown;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.isViewed = notification.isViewed;
    this.type = notification.type;
    this.payload = notification.payload;
  }
}
