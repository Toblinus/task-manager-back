import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResonseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiTags('Пользователь')
  @ApiResponse({
    status: 200,
    description: 'Текущий пользователь',
    type: UserResonseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/current')
  getCurrent(@Request() req: { user: User }) {
    return this.userService.createResponse(req.user);
  }
}
