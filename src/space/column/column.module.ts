import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { SpaceService } from '../space.service';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService, SpaceService],
  exports: [ColumnService],
})
export class ColumnModule {}
