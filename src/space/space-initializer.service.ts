import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ColumnService } from './column/column.service';
import { SpaceService } from './space.service';

@Injectable()
export class SpaceInitializerService {
  constructor(
    private readonly db: PrismaService,
    private readonly spaceService: SpaceService,
    private readonly columnService: ColumnService,
  ) {}

  async create(
    { name }: CreateSpaceDto,
    userId: string,
    asUser: boolean = false,
  ) {
    const space = await this.db.space.create({
      data: {
        name,
        ownerId: userId,
        id: asUser ? userId : undefined,
      },
    });
    await this.spaceService.addMembers(space.id, [userId]);
    // await this.columnService.createMany(space.id, [
    //   'Создано',
    //   'В работае',
    //   'Завершено',
    // ]);
    return space;
  }
}
