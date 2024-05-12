import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ColumnService } from './column/column.service';
import { SpaceService } from './space.service';
import { TaskStatusService } from './task-status/task.status.service';

@Injectable()
export class SpaceInitializerService {
  constructor(
    private readonly db: PrismaService,
    private readonly spaceService: SpaceService,
    private readonly columnService: ColumnService,
    private readonly statusService: TaskStatusService,
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

    const columnOfCreating = await this.columnService.create(space.id, {
      name: 'Создано',
    });
    const columnOfWorking = await this.columnService.create(space.id, {
      name: 'В работе',
    });
    const columnOfCompleted = await this.columnService.create(space.id, {
      name: 'Завершено',
    });

    const defaultStatus = await this.statusService.create({
      columnId: columnOfCreating.id,
      name: 'Создано',
      isCompleted: false,
    });

    await this.statusService.create({
      columnId: columnOfWorking.id,
      name: 'В работе',
      isCompleted: false,
    });

    await this.statusService.create({
      columnId: columnOfCompleted.id,
      name: 'Завершено',
      isCompleted: true,
    });

    return await this.spaceService.update(space.id, {
      defaultStatusId: defaultStatus.id,
    });
  }
}
