import { Injectable } from '@nestjs/common';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PrismaService } from 'src/database/prisma.service';
import { SpaceResponseDto } from './dto/space-response.dto';
import { SpaceListResponse } from './dto/space-list-response.dto';
import { UsersListResponseDto } from 'src/user/dto/users-list-response.dto';

@Injectable()
export class SpaceService {
  constructor(private readonly db: PrismaService) {}

  async findByUserId(userId: string) {
    const space = await this.db.spaceMember.findMany({
      where: { userId },
      select: { space: true },
    });

    return new SpaceListResponse(space.map((item) => item.space));
  }

  async findOne(id: string) {
    const space = await this.db.space.findFirst({
      where: {
        id,
      },
    });

    return new SpaceResponseDto(space);
  }

  async update(id: string, { name, defaultStatusId, ownerId }: UpdateSpaceDto) {
    const space = await this.db.space.update({
      data: {
        name,
        ownerId,
        defaultTaskStatusId: defaultStatusId,
      },
      where: {
        id,
      },
    });

    return new SpaceResponseDto(space);
  }

  async remove(id: string) {
    await this.db.space.delete({
      where: {
        id,
      },
    });
  }

  public async isOwner(spaceId: string, userId: string) {
    const space = await this.findOne(spaceId);

    if (!space) {
      return false;
    }

    return userId === space.ownerId;
  }

  public async isMember(spaceId: string, userId: string) {
    try {
      await this.db.spaceMember.findFirstOrThrow({
        where: {
          spaceId,
          userId,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async addMembers(spaceId: string, memberIds: string[]) {
    await this.db.spaceMember.createMany({
      skipDuplicates: true,
      data: memberIds.map((userId) => ({ spaceId, userId })),
    });

    return this.getMembers(spaceId);
  }

  public async removeMembers(spaceId: string, memberIds: string[]) {
    await this.db.spaceMember.deleteMany({
      where: { OR: memberIds.map((userId) => ({ spaceId, userId })) },
    });

    return this.getMembers(spaceId);
  }

  public async getMembers(spaceId: string) {
    const members = await this.db.spaceMember.findMany({
      where: { spaceId },
      select: { user: true },
    });

    return new UsersListResponseDto(members.map((item) => item.user));
  }
}
