import { Injectable } from '@nestjs/common';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TaskStatusResponseDto } from './dto/task-status-response.dto';
import { TaskStatusesListResponseDto } from './dto/task-statuses-list-response.dto';

@Injectable()
export class TaskStatusService {
  constructor(private readonly db: PrismaService) {}

  async create(status: CreateTaskStatusDto) {
    const column = await this.db.taskStatus.create({
      data: {
        ...status,
      },
      include: {
        column: {
          include: {
            space: true,
          },
        },
      },
    });

    return new TaskStatusResponseDto(column);
  }

  // async createMany(spaceId: string, columnNames: string[]) {
  //   await this.db.taskStatus.createMany({
  //     data: columnNames.map((name) => ({ name, spaceId })),
  //   });
  // }

  async findAllBySpaceId(spaceId: string) {
    const statuses = await this.db.taskStatus.findMany({
      where: {
        column: {
          spaceId,
        },
      },
      include: {
        column: {
          include: {
            space: true,
          },
        },
      },
    });

    return new TaskStatusesListResponseDto(statuses);
  }

  async findOne(id: string) {
    try {
      const status = await this.db.taskStatus.findFirst({
        where: {
          id,
        },
        include: {
          column: {
            include: {
              space: true,
            },
          },
        },
      });

      return new TaskStatusResponseDto(status);
    } catch {
      return null;
    }
  }

  async update(id: string, updateStatusDto: UpdateTaskStatusDto) {
    const column = await this.db.taskStatus.update({
      where: {
        id,
      },
      include: {
        column: {
          include: {
            space: true,
          },
        },
      },
      data: updateStatusDto,
    });

    return new TaskStatusResponseDto(column);
  }

  async remove(id: string) {
    await this.db.taskStatus.delete({
      where: {
        id,
      },
    });
  }
}
