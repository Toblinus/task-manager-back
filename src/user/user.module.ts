import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SpaceModule } from 'src/space/space.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [SpaceModule],
  exports: [UserService],
})
export class UserModule {}
