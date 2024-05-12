import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SpaceModule } from 'src/space/space.module';
import { CommentService } from 'src/task/comment/comment.service';

@Module({
  providers: [UserService, CommentService],
  controllers: [UserController],
  imports: [SpaceModule],
  exports: [UserService],
})
export class UserModule {}
