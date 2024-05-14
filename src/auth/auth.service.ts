import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from '@prisma/client';
// import { SpaceService } from 'src/space/space.service';
import { UserService } from 'src/user/user.service';
import { SessionService } from 'src/auth/session/session.service';
import { ConfigService } from 'src/config/config.service';
import type { UserWithoutPassword } from 'src/user/types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SessionResponseDto } from './session/dto/session-response.dto';
import { SpaceInitializerService } from 'src/space/space-initializer.service';

export type TSuccessTokenPayload = {
  /** UUID пользователя */
  sub: string;
  /** UUID сессии */
  session: string;
  /** Серия токена */
  series: string;
};

export type TRefreshTokenPayload = {
  /** UUID сессии */
  session: string;
  /** Значение из заголовка user-agent */
  useragent: string;
  /** Серия токена */
  series: string;
};

@Injectable()
export class AuthService {
  constructor(
    private spaceService: SpaceInitializerService,
    private userService: UserService,
    private sessionService: SessionService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(user: UserWithoutPassword, userAgent: string) {
    const session = await this.sessionService.create(user.id, userAgent);

    return {
      session: new SessionResponseDto(session),
      tokens: await this.generateTokens(session),
    };
  }

  async registry(user: CreateUserDto, userAgent: string) {
    // Добавляем пользователя
    const createdUser = await this.userService.create(user);

    // // Автоматически создаем личное пространство пользователя
    await this.spaceService.create(
      {
        name: `${createdUser.username} space`,
      },
      createdUser.id,
      true,
    );

    return [createdUser, await this.login(createdUser, userAgent)] as const;
  }

  async refreshToken(session: UserSession | SessionResponseDto) {
    const newSession = await this.sessionService.updateUsedTime(session.id);
    return await this.generateTokens(newSession);
  }

  async logout(session: UserSession | SessionResponseDto) {
    await this.sessionService.remove(session.id);
  }

  private async generateTokens(session: UserSession | SessionResponseDto) {
    const successTokenPayload: TSuccessTokenPayload = {
      sub: session.userId,
      session: session.id,
      series: session.series,
    };
    const accessToken = await this.jwtService.signAsync(successTokenPayload, {
      expiresIn: '15m',
      secret: this.configService.getAccessTokenSecret('private'),
    });

    const refreshTokenPayload: TRefreshTokenPayload = {
      session: session.id,
      series: session.series,
      useragent:
        typeof session.userAgent === 'string'
          ? session.userAgent
          : session.userAgent.raw,
    };
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '7d',
      secret: this.configService.getRefreshTokenSecret('private'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
