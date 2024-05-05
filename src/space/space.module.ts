import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { ColumnModule } from './column/column.module';
import { ColumnService } from './column/column.service';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, ColumnService],
  imports: [ColumnModule],
  exports: [SpaceService, ColumnService],
})
export class SpaceModule {}
