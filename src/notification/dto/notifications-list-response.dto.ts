import { Notification } from '@prisma/client';
import { NotificationResponseDto } from './notification-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationsListResponseDto {
  @ApiProperty({
    description: 'Список уведомлений',
    type: [NotificationResponseDto],
  })
  notifications: NotificationResponseDto[];

  constructor(notifications: Notification[]) {
    this.notifications = notifications.map(
      (notification) => new NotificationResponseDto(notification),
    );
  }
}
