import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Request as Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { UserTokensResponseDto } from './dto/user-token-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('AuthController')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Вход выполнен успешно',
    type: UserTokensResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Не удалось выполнить вход' })
  @ApiOperation({ summary: 'Вход' })
  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() { username, password }: UserLoginDto,
    @Req() request: Request,
  ) {
    const user = await this.userService.getByLogin(username);

    if (!user) {
      throw new BadRequestException();
    }

    const passwordIsCorrect = await this.userService.checkPassword(
      username,
      password,
    );

    if (!passwordIsCorrect) {
      throw new BadRequestException();
    }

    const tokens = await this.authService.login(
      user,
      request.headers['user-agent'],
    );
    return tokens;
  }

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 201,
    description: 'Регистрация выполнена успешно',
    type: UserTokensResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Не удалось выполнить регистрацию' })
  @ApiOperation({ summary: 'Регистрация' })
  @Post('/signup')
  async registry(@Body() createUser: CreateUserDto, @Req() request: Request) {
    try {
      const [, tokens] = await this.authService.registry(
        createUser,
        request.headers['user-agent'],
      );
      return tokens;
    } catch (e) {
      throw new BadRequestException(e?.message || e);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Обновление сессии выполнено успешно',
    type: UserTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован',
  })
  @ApiOperation({
    summary: 'Обновление сессии',
    description: 'Для выполнения, необходим токен обновления сессии',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('/refresh')
  async refresh(@Req() request: Request) {
    try {
      return await this.authService.refreshToken(request.user.session);
    } catch {
      throw new UnauthorizedException();
    }
  }

  @ApiResponse({
    status: 204,
    description: 'Завершение сессии выполнено успешно',
    type: UserTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Не авторизован',
  })
  @ApiOperation({ summary: 'Выход' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/logout')
  @HttpCode(204)
  async logout(@Req() request: Request) {
    try {
      await this.authService.logout(request.user.session);
      return '';
    } catch {
      throw new UnauthorizedException();
    }
  }
}
