import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/database/prisma.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { QueryFindTasksDto } from './dto/query-find-tasks.dto';
import { TasksListResponseDto } from './dto/tasks-list-response.dto';

@Injectable()
export class TaskService {
  constructor(private readonly db: PrismaService) {}

  async create(createTaskDto: CreateTaskDto & { authorId: string }) {
    const {
      authorId,
      description,
      executionAt,
      executorId,
      spaceId,
      title,
      statusId,
    } = createTaskDto;

    const task = await this.db.task.create({
      data: {
        description,
        executionAt,
        title,
        authorId,
        executorId,
        spaceId,
        statusId,
      },
      include: {
        author: true,
        executor: true,
        space: true,
        status: {
          include: {
            column: {
              include: {
                space: true,
              },
            },
          },
        },
      },
    });

    return new TaskResponseDto(task);
  }

  async findByQuery(query: QueryFindTasksDto) {
    const tasks = await this.db.task.findMany({
      where: query,
      include: {
        author: true,
        executor: true,
        space: true,
        status: {
          include: {
            column: {
              include: {
                space: true,
              },
            },
          },
        },
      },
    });

    return new TasksListResponseDto(tasks);
  }

  async findOne(id: string) {
    try {
      const task = await this.db.task.findFirstOrThrow({
        where: { id },
        include: {
          author: true,
          executor: true,
          space: true,
          status: {
            include: {
              column: {
                include: {
                  space: true,
                },
              },
            },
          },
        },
      });

      return new TaskResponseDto(task);
    } catch {
      return null;
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.db.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        author: true,
        executor: true,
        space: true,
        status: {
          include: {
            column: {
              include: {
                space: true,
              },
            },
          },
        },
      },
    });

    return new TaskResponseDto(task);
  }

  async remove(id: string) {
    await this.db.task.delete({
      where: { id },
    });
  }
}
