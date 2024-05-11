import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SessionsListResponseDto } from './dto/sessions-list-response.dto';
import { SessionResponseDto } from './dto/session-response.dto';

@Injectable()
export class SessionService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: string, userAgent: string) {
    const session = await this.db.userSession.create({
      data: {
        userAgent,
        userId,
      },
    });

    return session;
  }

  async remove(id: string) {
    await this.db.userSession.delete({
      where: {
        id,
      },
    });
  }

  async getById(id: string) {
    try {
      const session = await this.db.userSession.findFirstOrThrow({
        where: {
          id,
        },
      });

      return new SessionResponseDto(session);
    } catch {
      return null;
    }
  }

  async getByUserId(userId: string) {
    try {
      const sessions = await this.db.userSession.findMany({
        where: {
          userId,
        },
      });

      return new SessionsListResponseDto(sessions);
    } catch {
      return { sessions: [] };
    }
  }

  async updateUsedTime(id: string) {
    await this.db.userSession.update({
      where: {
        id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async isOwner(sessionId: string, userId: string) {
    try {
      const session = await this.db.userSession.findFirstOrThrow({
        where: {
          id: sessionId,
          userId,
        },
      });

      return !!session;
    } catch {
      return false;
    }
  }
}
