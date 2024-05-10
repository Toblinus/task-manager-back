import { Injectable } from '@nestjs/common';
import { UserResonseDto } from './dto/user-response.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user-dto';
import { UserWithoutPassword } from './types';

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  createResponse(user: UserWithoutPassword) {
    return new UserResonseDto(user);
  }

  async create(user: CreateUserDto) {
    const { username, password } = user;

    const salt = await bcrypt.genSalt();

    // Добавляем пользователя
    const createdUser = await this.db.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, salt),
      },
    });

    return createdUser;
  }

  async checkPassword(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.getFullByLogin(username);

      if (!user) {
        return false;
      }

      const { password: passwordHash } = user;

      return await bcrypt.compare(password, passwordHash);
    } catch {
      return false;
    }
  }

  async getById(id: string) {
    try {
      const user = await this.db.user.findFirstOrThrow({
        where: {
          id,
        },
      });

      return this.createResponse(user);
    } catch {
      return null;
    }
  }

  async remove(id: string) {
    await this.db.user.delete({
      where: {
        id,
      },
    });
  }

  async getByLogin(username: string) {
    try {
      const user = await this.getFullByLogin(username);

      return user ? this.createResponse(user) : null;
    } catch {
      return null;
    }
  }

  private async getFullByLogin(username: string) {
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
