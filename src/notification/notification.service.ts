import { Injectable, MessageEvent } from '@nestjs/common';
import { ReplaySubject, Subject } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationsListResponseDto } from './dto/notifications-list-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private db: PrismaService) {}

  private streams: Map<string, Subject<MessageEvent>> = new Map();

  createStream(id: string) {
    if (!this.streams.has(id)) {
      this.streams.set(id, new ReplaySubject(5));
    }

    const stream = this.streams.get(id);

    stream.subscribe((msg) => {
      console.log(msg);
    });

    return stream;
  }

  removeStream(id: string) {
    if (this.streams.has(id)) {
      this.streams.delete(id);
    }
  }

  async send(targetId: string, data: CreateNotificationDto) {
    const nofication = await this.db.notification.create({
      data: {
        recipientId: targetId,
        type: data.type,
        payload: data.payload,
      },
    });

    if (this.streams.has(targetId)) {
      this.streams.get(targetId).next({
        id: nofication.id,
        type: nofication.type,
        data: {
          type: nofication.type,
          payload: nofication.payload,
        },
      });
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const notification = await this.db.notification.findFirstOrThrow({
        where: {
          id,
          recipientId: userId,
        },
      });
      return new NotificationResponseDto(notification);
    } catch {
      return null;
    }
  }

  async findByUserId(userId: string) {
    const notifications = await this.db.notification.findMany({
      where: {
        recipientId: userId,
      },
    });

    return new NotificationsListResponseDto(notifications);
  }

  async removeById(id: string) {
    await this.db.notification.delete({
      where: {
        id,
      },
    });
  }

  async updateById(id: string, data?: UpdateNotificationDto) {
    const isViewed = typeof data?.isViewed === 'boolean' ? data.isViewed : true;

    const notification = await this.db.notification.update({
      where: {
        id,
      },
      data: {
        isViewed,
      },
    });

    return new NotificationResponseDto(notification);
  }
}
