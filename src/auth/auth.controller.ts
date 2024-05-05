import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { UserResonseDto } from 'src/user/dto/user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiTags('Авторизация')
  @ApiResponse({
    status: 200,
    description: 'Вход выполнен успешно',
    type: UserResonseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 401, description: 'Не удалось выполнить вход' })
  @Post('/login')
  async login(
    @Body() { username, password }: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.getByLogin(username);

    if (!user) {
      throw new NotFoundException();
    }

    const passwordIsCorrect = await this.userService.checkPassword(
      user,
      password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException();
    }

    await this.authService.login(user, res);
    return this.userService.createResponse(user);
  }

  @ApiTags('Авторизация')
  @ApiResponse({
    status: 200,
    description: 'Регистрация выполнена успешно',
    type: UserResonseDto,
  })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @Post('/registry')
  async registry(
    @Body() createUser: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const [user] = await this.authService.registry(createUser, res);
      return this.userService.createResponse(user);
    } catch (e) {
      throw new BadRequestException(e?.message || e);
    }
  }
}
