import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from 'src/database/prisma.service';
import { SpaceService } from '../space.service';

@Injectable()
export class ColumnService {
  constructor(
    private readonly db: PrismaService,
    // private readonly spaceService: SpaceService,
  ) {}

  async create({ name, spaceId }: CreateColumnDto) {
    // const space = await this.spaceService.findOne(spaceId);

    // if (!space) {
    //   return; // @TODO: add status 404
    // }

    this.db.columnSpace.create({
      data: {
        name,
        spaceId,
      },
    });
  }

  async createMany(spaceId: string, columnNames: string[]) {
    // const space = await this.spaceService.findOne(spaceId);

    // if (!space) {
    //   return; // @TODO: add status 404
    // }

    const cols = await this.db.columnSpace.createMany({
      data: columnNames.map((name) => ({ name, spaceId })),
    });

    return cols;
  }

  findAll() {
    return `This action returns all column`;
  }

  findOne(id: number) {
    return `This action returns a #${id} column`;
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}
