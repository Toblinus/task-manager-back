import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TSuccessTokenPayload } from '../auth.service';
import type { Request } from 'express';
import { SessionService } from 'src/auth/session/session.service';
import type { UserWithSession } from '../types';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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
      secretOrKey: configService.getAccessTokenSecret('public'),
    });
  }

  async validate(payload: TSuccessTokenPayload): Promise<UserWithSession> {
    const user = await this.userService.getById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionService.getById(payload.session);
    if (!session) {
      throw new UnauthorizedException();
    }

    return { ...user, session };
  }
}
