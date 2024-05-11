import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ColumnResponseDto } from './dto/column-response.dto';
import { ColumnListResponseDto } from './dto/column-list-response.dto';

@Injectable()
export class ColumnService {
  constructor(private readonly db: PrismaService) {}

  async create(spaceId: string, { name }: CreateColumnDto) {
    const column = await this.db.columnSpace.create({
      data: {
        name,
        spaceId,
      },
      include: {
        space: true,
      },
    });

    return new ColumnResponseDto(column);
  }

  async createMany(spaceId: string, columnNames: string[]) {
    await this.db.columnSpace.createMany({
      data: columnNames.map((name) => ({ name, spaceId })),
    });
  }

  async findAll(spaceId: string) {
    const columns = await this.db.columnSpace.findMany({
      where: {
        spaceId,
      },
      include: {
        space: true,
      },
    });

    return new ColumnListResponseDto(columns);
  }

  async findOne(id: string) {
    try {
      const column = await this.db.columnSpace.findFirst({
        where: {
          id,
        },
        include: {
          space: true,
        },
      });

      return new ColumnResponseDto(column);
    } catch {
      return null;
    }
  }

  async update(id: string, updateColumnDto: UpdateColumnDto) {
    const column = await this.db.columnSpace.update({
      where: {
        id,
      },
      include: {
        space: true,
      },
      data: updateColumnDto,
    });

    return new ColumnResponseDto(column);
  }

  async remove(id: string) {
    await this.db.columnSpace.delete({
      where: {
        id,
      },
    });
  }
}
