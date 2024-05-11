import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ description: 'Название столбца' })
  @IsString()
  name: string;
}
