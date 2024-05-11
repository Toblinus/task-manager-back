import { Module } from '@nestjs/common';
import { TaskStatusService } from './task.status.service';
import { TaskStatusController } from './task-status.controller';
import { SpaceService } from '../space.service';

@Module({
  controllers: [TaskStatusController],
  providers: [TaskStatusService, SpaceService],
  exports: [TaskStatusService],
})
export class TaskStatusModule {}
