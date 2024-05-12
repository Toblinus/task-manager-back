import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SpaceModule } from 'src/space/space.module';
import { UserModule } from 'src/user/user.module';
import { TaskStatusModule } from 'src/space/task-status/task-status.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [SpaceModule, UserModule, TaskStatusModule],
  exports: [TaskService],
})
export class TaskModule {}
