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
import { ColumnService } from './column.service';
import { UpdateColumnDto } from './dto/update-column.dto';
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
import { ColumnResponseDto } from './dto/column-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Columns')
@Controller('space/columns')
export class ColumnController {
  constructor(
    private readonly columnService: ColumnService,
    private readonly spaceService: SpaceService,
  ) {}

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Столбец получен по id',
    type: ColumnResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Столбец не найден' })
  @ApiOperation({
    summary: 'Получение столбца по id',
  })
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const column = await this.columnService.findOne(id);

    if (!column) {
      throw new NotFoundException();
    }

    return column;
  }

  @ApiResponse({
    status: 200,
    description: 'Столбец обновлен',
    type: ColumnResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Столбец не найден' })
  @ApiOperation({ summary: 'Изменение столбца' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Req() req: Request,
  ) {
    const column = await this.columnService.findOne(id);

    if (!column) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(column.space.id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.columnService.update(id, updateColumnDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Столбец удален',
    type: ColumnResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Столбец не найден' })
  @ApiOperation({ summary: 'Удаление столбца' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const column = await this.columnService.findOne(id);

    if (!column) {
      throw new NotFoundException();
    }

    if (!(await this.spaceService.isOwner(column.space.id, req.user.id))) {
      throw new ForbiddenException();
    }

    return this.columnService.remove(id);
  }
}
