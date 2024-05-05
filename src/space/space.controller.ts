import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSpaceDto: CreateSpaceDto,
    @Request() req: { user: User },
  ) {
    return this.spaceService.create(createSpaceDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.spaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
    @Request() req: { user: User },
  ) {
    return this.spaceService.update(id, updateSpaceDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.spaceService.remove(id, req.user.id);
  }
}
