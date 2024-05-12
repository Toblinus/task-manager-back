import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SessionModule } from 'src/auth/session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { SpaceModule } from 'src/space/space.module';

@Module({
  imports: [PassportModule, JwtModule.register({}), SessionModule, SpaceModule],
  providers: [AuthService, UserService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
