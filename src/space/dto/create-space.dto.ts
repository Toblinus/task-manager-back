import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty()
  name: string;
}
