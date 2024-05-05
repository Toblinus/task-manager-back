import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { TJWTPayload } from '../auth.service';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          return req.cookies?.['token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: TJWTPayload) {
    const user = await this.userService.getById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
