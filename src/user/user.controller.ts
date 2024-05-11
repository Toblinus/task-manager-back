import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResonseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UsersListResponseDto } from './dto/users-list-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('UsersController')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'Текущий пользователь',
    type: UserResonseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiOperation({ summary: 'Получение текущего авторизованного пользователя' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/current')
  getCurrent(@Req() req: Request) {
    return this.userService.createResponse(req.user);
  }

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Пользователь',
    type: UserResonseDto,
  })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiOperation({ summary: 'Получение пользователя по id' })
  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.userService.getById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Пользователь',
    type: UsersListResponseDto,
  })
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @Get('/')
  getAll() {
    return this.userService.getAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Текущий пользователь изменен',
    type: UserResonseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiOperation({ summary: 'Изменение текущего авторизованного пользователя' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/current')
  async updateCurrent(@Req() req: Request, @Body() body: UpdateUserDto) {
    const { oldPassword, ...user } = body;

    const { username: prevUsername } = req.user;

    const isChangePasswordConfirm = this.userService.checkPassword(
      prevUsername,
      oldPassword,
    );

    if (!isChangePasswordConfirm) {
      throw new BadRequestException();
    }

    try {
      return await this.userService.update(req.user.id, user);
    } catch {
      throw new BadRequestException();
    }
  }

  @ApiResponse({
    status: 204,
    description: 'Пользователь удален',
    type: UserResonseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiOperation({ summary: 'Удаление текущего авторизованного пользователя' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/current')
  @HttpCode(204)
  removeCurrent(@Req() req: Request) {
    return this.userService.remove(req.user.id);
  }
}
