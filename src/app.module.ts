import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ValidatorModule } from './validator/validator.module';
import { SpaceModule } from './space/space.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    SpaceModule,
    TaskModule,
    ValidatorModule,
    NotificationModule,
  ],
})
export class AppModule {}
