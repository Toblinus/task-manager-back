import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { SpaceService } from 'src/space/space.service';

type CookieSetter = Pick<Response, 'cookie'>;

export type TJWTPayload = {
  /** UUID пользователя */
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private spaceService: SpaceService,
    private jwtService: JwtService,
  ) {}

  async login(user: User, res: CookieSetter) {
    const payload: TJWTPayload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    res.cookie('token', accessToken, {
      httpOnly: true,
      maxAge: 4 * 60 * 60 * 1000,
    });
    return {
      access_token: accessToken,
    };
  }

  async registry(user: CreateUserDto, res: CookieSetter) {
    const { username, password } = user;

    const salt = await bcrypt.genSalt();

    // Добавляем пользователя
    const createdUser = await this.db.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, salt),
      },
    });

    // Автоматически создаем личное пространство пользователя
    await this.spaceService.create(
      {
        name: `${username} space`,
      },
      createdUser.id,
      true,
    );

    return [createdUser, this.login(createdUser, res)] as const;
  }
}
