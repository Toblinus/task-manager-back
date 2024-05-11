import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  HttpCode,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { TaskStatusService } from './task.status.service';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SpaceService } from '../space.service';
import { TaskStatusResponseDto } from './dto/task-status-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Task statuses')
@Controller('space/statuses')
export class TaskStatusController {
  constructor(
    private readonly taskStatusService: TaskStatusService,
    private readonly spaceService: SpaceService,
  ) {}

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Статус получен по id',
    type: TaskStatusResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Статус не найден' })
  @ApiOperation({
    summary: 'Получение статуса по id',
  })
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const status = await this.taskStatusService.findOne(id);

    if (!status) {
      throw new NotFoundException();
    }

    return status;
  }

  @ApiResponse({
    status: 200,
    description: 'Статус обновлен',
    type: TaskStatusResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Статус не найден' })
  @ApiOperation({ summary: 'Изменение статуса' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateColumnDto: UpdateTaskStatusDto,
    @Req() req: Request,
  ) {
    const status = await this.taskStatusService.findOne(id);

    if (!status) {
      throw new NotFoundException();
    }

    if (
      !(await this.spaceService.isOwner(status.column.space.id, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    return this.taskStatusService.update(id, updateColumnDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Столбец удален',
    type: TaskStatusResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Статус не найден' })
  @ApiOperation({ summary: 'Удаление столбца' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const status = await this.taskStatusService.findOne(id);

    if (!status) {
      throw new NotFoundException();
    }

    if (
      !(await this.spaceService.isOwner(status.column.space.id, req.user.id))
    ) {
      throw new ForbiddenException();
    }

    return this.taskStatusService.remove(id);
  }
}
