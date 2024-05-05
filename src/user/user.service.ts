import { Injectable } from '@nestjs/common';
import { UserResonseDto } from './dto/user-response.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  createResponse(user: User) {
    return new UserResonseDto(user);
  }

  async checkPassword(
    userOrLogin: string | User,
    password: string,
  ): Promise<boolean> {
    try {
      const user =
        typeof userOrLogin === 'string'
          ? await this.getByLogin(userOrLogin)
          : userOrLogin;

      const { password: passwordHash } = user;

      return await bcrypt.compare(password, passwordHash);
    } catch {
      return false;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      return await this.db.user.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch {
      return null;
    }
  }

  async getByLogin(username: string): Promise<User> {
    try {
      return await this.db.user.findFirstOrThrow({
        where: {
          username,
        },
      });
    } catch {
      return null;
    }
  }
}
