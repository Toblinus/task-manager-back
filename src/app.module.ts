import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ValidatorModule } from './validator/validator.module';
import { SpaceModule } from './space/space.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    SpaceModule,
    AuthModule,
    UserModule,
    ValidatorModule,
  ],
})
export class AppModule {}
