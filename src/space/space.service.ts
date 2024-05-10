import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ColumnService } from './column/column.service';

@Injectable()
export class SpaceService {
  constructor(
    private readonly db: PrismaService,
    private readonly columnService: ColumnService,
  ) {}

  async create(
    { name }: CreateSpaceDto,
    userId: string,
    asUser: boolean = false,
  ) {
    // const space = await this.db.space.create({
    //   data: {
    //     name,
    //     ownerId: userId,
    //     id: asUser ? userId : undefined,
    //   },
    // });
    // await this.columnService.createMany(space.id, [
    //   'Создано',
    //   'В работае',
    //   'Завершено',
    // ]);
    // return space;
  }

  async findAll() {
    return await this.db.space.findMany();
  }

  async findOne(id: string) {
    return await this.db.space.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: string, { name }: UpdateSpaceDto, userId: string) {
    if (!(await this.isOwner(id, userId))) {
      // @TODO: add error 403
      return;
    }

    const space = await this.db.space.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });
    return space;
  }

  async remove(id: string, userId: string) {
    if (!(await this.isOwner(id, userId))) {
      // @TODO: add error 403
      return;
    }

    await this.db.space.delete({
      where: {
        id,
      },
    });
  }

  public async isOwner(spaceId: string, userId: string) {
    const space = await this.findOne(userId);

    if (!space) {
      return false;
    }

    return userId === space.ownerId;
  }
}
