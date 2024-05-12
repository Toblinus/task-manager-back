import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SpaceInitializerService } from './space-initializer.service';
import { Request } from 'express';
import { SpaceMembersListDto } from './dto/space-members-list.dto';
import { UsersListResponseDto } from 'src/user/dto/users-list-response.dto';
import { CreateColumnDto } from './column/dto/create-column.dto';
import { ColumnService } from './column/column.service';
import { ColumnListResponseDto } from './column/dto/column-list-response.dto';
import { ColumnResponseDto } from './column/dto/column-response.dto';
import { TaskStatusService } from './task-status/task.status.service';
import { TaskStatusResponseDto } from './task-status/dto/task-status-response.dto';
import { CreateTaskStatusDto } from './task-status/dto/create-task-status.dto';
import { TaskStatusesListResponseDto } from './task-status/dto/task-statuses-list-response.dto';

@ApiTags('Space')
@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly spaceServiceInitilizer: SpaceInitializerService,
    private readonly columnService: ColumnService,
    private readonly taskStatusService: TaskStatusService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Пространство задач создано',
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiOperation({ summary: 'Создание нового пространства задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSpaceDto: CreateSpaceDto, @Req() req: Request) {
    return this.spaceServiceInitilizer.create(createSpaceDto, req.user.id);
  }

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Пространство задач',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({ summary: 'Получение пространства' })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    return this.spaceService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Пространство задач обновлено',
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Сущность из запроса не найдена' })
  @ApiOperation({ summary: 'Изменение пространства задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
    @Req() req: Request,
  ) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException('Space not found');
    }

    if (!(await this.spaceService.isOwner(id, req.user.id))) {
      throw new ForbiddenException();
    }

    if (
      updateSpaceDto.ownerId &&
      !(await this.spaceService.isMember(id, updateSpaceDto.ownerId))
    ) {
      throw new NotFoundException('Memeber (user) not found');
    }

    if (updateSpaceDto.defaultStatusId) {
      const status = await this.taskStatusService.findOne(
        updateSpaceDto.defaultStatusId,
      );

      if (!status) {
        throw new NotFoundException('Memeber (user) not found');
      }

      if (status.column.space.id !== id) {
        throw new ForbiddenException();
      }
    }

    return this.spaceService.update(id, updateSpaceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Пользователи добавлены в пространство задач',
    type: UsersListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({ summary: 'Добавление пользователей в пространство задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/users')
  @HttpCode(200)
  async addMembers(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { members }: SpaceMembersListDto,
    @Req() req: Request,
  ) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.spaceService.addMembers(id, members);
  }

  @ApiResponse({
    status: 200,
    description: 'Пользователи удалены из пространства задач',
    type: UsersListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({ summary: 'Удаление пользователей из пространства задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/users')
  @HttpCode(200)
  async removeMembers(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() { members }: SpaceMembersListDto,
    @Req() req: Request,
  ) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.spaceService.removeMembers(id, members);
  }

  @ApiResponse({
    status: 200,
    description: 'Пользователи в пространстве задач',
    type: UsersListResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({
    summary: 'Получение списка пользователей из пространства задач',
  })
  @Get(':id/users')
  @HttpCode(200)
  async getMembers(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    return this.spaceService.getMembers(id);
  }

  @ApiResponse({
    status: 204,
    description: 'Пространство задач удалено',
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({ summary: 'Удаление пространства задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.spaceService.remove(id);
  }

  @ApiTags('Columns')
  @ApiResponse({
    status: 201,
    description: 'Столбец добавлен в пространство',
    type: ColumnResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({ summary: 'Добавление столбца в пространство задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/columns')
  async addColumn(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() column: CreateColumnDto,
    @Req() req: Request,
  ) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.columnService.create(id, column);
  }

  @ApiTags('Columns', 'PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Столбцы из пространства задач',
    type: ColumnListResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({
    summary: 'Получение списка столбцов в пространстве задач',
  })
  @Get(':id/columns')
  @HttpCode(200)
  async getColumns(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    return this.columnService.findAll(id);
  }

  @ApiTags('Task statuses')
  @ApiResponse({
    status: 201,
    description: 'Статус добавлен в пространство',
    type: TaskStatusResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({ summary: 'Добавление статуса в пространство задач' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('statuses')
  async addStatus(@Body() status: CreateTaskStatusDto, @Req() req: Request) {
    const column = await this.columnService.findOne(status.columnId);

    if (!column) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(column.space.id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.taskStatusService.create(status);
  }

  @ApiTags('Task statuses', 'PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Статусы из пространства задач',
    type: TaskStatusesListResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Пространство не найдено' })
  @ApiOperation({
    summary: 'Получение списка статусов в пространстве задач',
  })
  @Get(':id/statuses')
  @HttpCode(200)
  async getStatuses(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.spaceService.findOne(id))) {
      throw new NotFoundException();
    }

    return this.taskStatusService.findAllBySpaceId(id);
  }
}
