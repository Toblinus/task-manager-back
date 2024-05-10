import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SessionModule } from './session/session.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [SessionModule],
})
export class UserModule {}
