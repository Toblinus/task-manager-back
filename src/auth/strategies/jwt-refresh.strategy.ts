import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TRefreshTokenPayload } from '../auth.service';
import type { Request } from 'express';
import { SessionService } from 'src/user/session/session.service';
import type { UserWithSession } from '../types';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          return req.cookies?.['token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getRefreshTokenSecret('public'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: TRefreshTokenPayload,
  ): Promise<UserWithSession> {
    const currentUserAgent = request.headers['user-agent'];

    const session = await this.sessionService.getById(payload.session);
    if (!session) {
      throw new UnauthorizedException();
    }

    if (currentUserAgent !== session.userAgent) {
      // TODO: notify
      throw new UnauthorizedException();
    }

    const user = await this.userService.getById(session.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return { ...user, session };
  }
}
