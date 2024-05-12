import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateSpaceDto } from './create-space.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {
  @ApiPropertyOptional({ description: 'Новый владелец пространства' })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @IsUUID()
  @IsOptional()
  defaultStatusId?: string;
}
