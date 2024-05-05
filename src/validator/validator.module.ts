import { Module } from '@nestjs/common';
import { ValidatorController } from './validator.controller';
import { ValidatorService } from './validator.service';

@Module({
  controllers: [ValidatorController],
  providers: [ValidatorService],
})
export class ValidatorModule {}
