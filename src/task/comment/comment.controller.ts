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
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Task comments')
@Controller('/tasks/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Комментарий получены',
    type: CommentResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiNotFoundResponse({ description: 'Комментарий не найден' })
  @ApiOperation({
    summary: 'Получение комментария по id',
  })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const comment = this.commentService.findOne(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return comment;
  }

  @ApiResponse({
    status: 201,
    description: 'Комментарий изменен',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Комментарий не найден' })
  @ApiOperation({ summary: 'Изменение комментария' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() request: Request,
  ) {
    const comment = await this.commentService.findOne(id);

    if (!comment) {
      throw new NotFoundException();
    }

    if (request.user.id !== comment.author.id) {
      throw new ForbiddenException();
    }

    return this.commentService.update(id, updateCommentDto);
  }

  @ApiResponse({
    status: 204,
    description: 'Комментарий удален',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации' })
  @ApiForbiddenResponse({ description: 'Операция не разрешена' })
  @ApiNotFoundResponse({ description: 'Комментарий не найден' })
  @ApiOperation({ summary: 'Удаление комментария' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Req() request: Request) {
    const comment = await this.commentService.findOne(id);

    if (!comment) {
      throw new NotFoundException();
    }

    const isSpaceOwner = request.user.id === comment.task.space.ownerId;
    const isTaskAuthor = request.user.id === comment.task.author.id;
    const isCommentAuthor = request.user.id === comment.author.id;

    if (!(isSpaceOwner || isTaskAuthor || isCommentAuthor)) {
      throw new ForbiddenException();
    }

    return this.commentService.remove(id);
  }
}
