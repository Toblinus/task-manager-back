import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SpaceModule } from 'src/space/space.module';
import { ColumnService } from 'src/space/column/column.service';
import { SpaceService } from 'src/space/space.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '4h' },
    }),
    SpaceModule,
  ],
  providers: [AuthService, UserService, JwtStrategy, SpaceService],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
