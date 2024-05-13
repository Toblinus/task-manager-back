import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { Request } from 'express';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { NotificationsListResponseDto } from './dto/notifications-list-response.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private notifications: NotificationService) {}

  @ApiResponse({
    status: 200,
    description: 'Уведомление получено',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiOperation({ summary: 'Получение уведомления' })
  @ApiNotFoundResponse({ description: 'Уведомление не найдено' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const notification = await this.notifications.findOne(id, req.user.id);

    if (!notification) {
      throw new NotFoundException();
    }

    return notification;
  }

  @ApiResponse({
    status: 200,
    description: 'Уведомления получены',
    type: NotificationsListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiOperation({ summary: 'Получение списка уведомлений пользователя' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getListByUser(@Req() req: Request) {
    const notifications = await this.notifications.findByUserId(req.user.id);

    return notifications;
  }

  @ApiResponse({
    status: 204,
    description: 'Уведомление удалено',
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiOperation({ summary: 'Удаление уведомления' })
  @ApiNotFoundResponse({ description: 'Уведомление не найдено' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletetOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const notification = await this.notifications.findOne(id, req.user.id);

    if (!notification) {
      throw new NotFoundException();
    }

    await this.notifications.removeById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Уведомление обновлено',
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiOperation({ summary: 'Обновление уведомления' })
  @ApiNotFoundResponse({ description: 'Уведомление не найдено' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(200)
  async updateOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateNotificationDto,
    @Req() req: Request,
  ) {
    const notification = await this.notifications.findOne(id, req.user.id);

    if (!notification) {
      throw new NotFoundException();
    }

    await this.notifications.updateById(id, data);
  }
}
