import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SessionService } from './session.service';
import { SessionResponseDto } from './dto/session-response.dto';
import { SessionsListResponseDto } from './dto/sessions-list-response.dto';

@ApiTags('Auth')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('auth/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiResponse({
    status: 200,
    description: 'Список сессий текущего пользователя получен',
    type: SessionsListResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiOperation({ summary: 'Получение списка сессий текущего пользователя' })
  @Get('/')
  async getList(@Req() request: Request) {
    return this.sessionService.getByUserId(request.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Данные сессии получены',
    type: SessionResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Сессия не найдена' })
  @ApiOperation({ summary: 'Получение сессии' })
  @Get('/:id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
  ) {
    const userId = request.user.id;

    if (!(await this.sessionService.isOwner(id, userId))) {
      throw new NotFoundException();
    }

    return await this.sessionService.getById(id);
  }

  @ApiResponse({
    status: 204,
    description: 'Сессия удалена',
  })
  @ApiUnauthorizedResponse({ description: 'Не авторизован' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Сессия не найдена' })
  @ApiOperation({ summary: 'Удаление сессии' })
  @Delete('/:id')
  @HttpCode(204)
  async deleteById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
  ) {
    const userId = request.user.id;

    if (!(await this.sessionService.isOwner(id, userId))) {
      throw new NotFoundException();
    }

    await this.sessionService.remove(id);
  }
}
