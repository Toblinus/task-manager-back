import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentsListResponseDto } from './dto/comments-list-response.dto';

@Injectable()
export class CommentService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: string, taskId: string, { body }: CreateCommentDto) {
    const comment = await this.db.taskComment.create({
      data: {
        body,
        authorId: userId,
        taskId,
      },
      include: {
        author: true,
        task: {
          include: {
            author: true,
            executor: true,
            space: true,
            status: {
              include: {
                column: {
                  include: {
                    space: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new CommentResponseDto(comment);
  }

  async findByUser(userId: string) {
    const tasks = await this.db.taskComment.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
        task: {
          include: {
            author: true,
            executor: true,
            space: true,
            status: {
              include: {
                column: {
                  include: {
                    space: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new CommentsListResponseDto(tasks);
  }

  async findByTask(taskId: string) {
    const tasks = await this.db.taskComment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
        task: {
          include: {
            author: true,
            executor: true,
            space: true,
            status: {
              include: {
                column: {
                  include: {
                    space: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new CommentsListResponseDto(tasks);
  }

  async findOne(id: string) {
    try {
      const task = await this.db.taskComment.findFirstOrThrow({
        where: { id },
        include: {
          author: true,
          task: {
            include: {
              author: true,
              executor: true,
              space: true,
              status: {
                include: {
                  column: {
                    include: {
                      space: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return new CommentResponseDto(task);
    } catch {
      return null;
    }
  }

  async update(id: string, { body }: UpdateCommentDto) {
    const task = await this.db.taskComment.update({
      data: {
        body,
        updatedAt: new Date(),
      },
      where: {
        id,
      },
      include: {
        author: true,
        task: {
          include: {
            author: true,
            executor: true,
            space: true,
            status: {
              include: {
                column: {
                  include: {
                    space: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return new CommentResponseDto(task);
  }

  async remove(id: string) {
    await this.db.taskComment.delete({ where: { id } });
  }
}
