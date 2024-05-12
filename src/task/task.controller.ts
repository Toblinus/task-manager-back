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
  NotFoundException,
  ForbiddenException,
  ParseUUIDPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { SpaceService } from 'src/space/space.service';
import { UserService } from 'src/user/user.service';
import { TaskStatusService } from 'src/space/task-status/task.status.service';
import { TaskResponseDto } from './dto/task-response.dto';
import { QueryFindTasksDto } from './dto/query-find-tasks.dto';
import { TasksListResponseDto } from './dto/tasks-list-response.dto';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly spaceService: SpaceService,
    private readonly userService: UserService,
    private readonly taskStatusService: TaskStatusService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Задача создана',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Сущность из запроса не найдена' })
  @ApiOperation({ summary: 'Создание задачи' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() request: Request) {
    const authorId = request.user.id;

    const space = await this.spaceService.findOne(createTaskDto.spaceId);

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const canCreateTask = await this.spaceService.isMember(space.id, authorId);

    if (!canCreateTask) {
      throw new ForbiddenException();
    }

    const executor = await this.userService.getById(createTaskDto.executorId);

    if (!executor) {
      throw new NotFoundException('Executor (user) not found');
    }

    const statusId: string =
      createTaskDto.statusId || space.defaultTaskStatusId;

    const status = await this.taskStatusService.findOne(statusId);

    if (!status) {
      throw new NotFoundException('Status not found');
    }

    return this.taskService.create({
      ...createTaskDto,
      statusId,
      authorId,
    });
  }

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Список задача',
    type: TasksListResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Сущность из запроса не найдена' })
  @ApiOperation({
    summary: 'Получение списка задач',
  })
  @Get()
  async findByQuery(@Query() query: QueryFindTasksDto) {
    if (query.spaceId) {
      if (!(await this.taskService.findOne(query.spaceId))) {
        throw new NotFoundException('Space not found');
      }
    }

    if (query.statusId) {
      if (!(await this.taskStatusService.findOne(query.statusId))) {
        throw new NotFoundException('Task status not found');
      }
    }

    if (query.authorId) {
      if (!(await this.userService.getById(query.authorId))) {
        throw new NotFoundException('Author (user) not found');
      }
    }

    if (query.executorId) {
      if (!(await this.userService.getById(query.executorId))) {
        throw new NotFoundException('Executor (user) not found');
      }
    }

    return this.taskService.findByQuery(query);
  }

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Задача получена по id',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Задача не найдена' })
  @ApiOperation({
    summary: 'Получение задачи по id',
  })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const task = this.taskService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  @ApiResponse({
    status: 200,
    description: 'Задача изменена',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Сущность из задачи не найдена' })
  @ApiOperation({ summary: 'Изменение задачи' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request: Request,
  ) {
    const task = await this.taskService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    const userId = request.user.id;

    const isSpaceOwner = userId === task.space.ownerId;
    const isTaskAuthor = userId === task.author.id;
    const isTaskExecutor = userId === task.executor.id;

    const fields = Object.keys(updateTaskDto) as (keyof UpdateTaskDto)[];

    const hasChangeStatus = fields.includes('statusId');
    const hasChangeExecutor = fields.includes('statusId');
    const hasChangeBaseInfo = (
      ['description', 'executorId', 'title'] as (keyof UpdateTaskDto)[]
    ).every((field: keyof UpdateTaskDto) => fields.includes(field));

    const canChangeStatus =
      (hasChangeStatus && isTaskExecutor) || !hasChangeStatus;

    const canEditBaseInfo =
      (hasChangeBaseInfo && isTaskAuthor) || !hasChangeBaseInfo;

    const canEditExecutor =
      hasChangeExecutor &&
      (isTaskAuthor || isTaskExecutor || updateTaskDto.executorId === userId);

    if (
      !(isSpaceOwner || canChangeStatus || canEditBaseInfo || canEditExecutor)
    ) {
      throw new ForbiddenException();
    }

    if (hasChangeExecutor) {
      const executor = await this.userService.getById(updateTaskDto.executorId);

      if (!executor) {
        throw new NotFoundException('Executor (user) not found');
      }
    }

    if (hasChangeStatus) {
      const statusId: string =
        updateTaskDto.statusId || task.space.defaultTaskStatusId;

      const status = await this.taskStatusService.findOne(statusId);

      if (!status) {
        throw new NotFoundException('Status not found');
      }
    }

    return this.taskService.update(id, updateTaskDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Задача удалена',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Задача не найдена' })
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
  ) {
    const task = await this.taskService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    const userId = request.user.id;

    const isSpaceOwner = userId === task.space.ownerId;
    const isTaskAuthor = userId === task.author.id;

    const canDelete = isSpaceOwner || isTaskAuthor;

    if (!canDelete) {
      throw new ForbiddenException();
    }

    await this.taskService.remove(id);
  }
}
