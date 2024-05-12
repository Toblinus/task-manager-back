import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { ColumnModule } from './column/column.module';
import { SpaceInitializerService } from './space-initializer.service';
import { TaskStatusModule } from './task-status/task-status.module';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, SpaceInitializerService],
  imports: [ColumnModule, TaskStatusModule],
  exports: [SpaceService, SpaceInitializerService],
})
export class SpaceModule {}
