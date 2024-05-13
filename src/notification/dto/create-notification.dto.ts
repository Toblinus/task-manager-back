import { NotificationType } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export class CreateNotificationDto<P extends any = any> {
  type: NotificationType = NotificationType.INFO;
  payload?: P = null;
}
