import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @ApiProperty({ type: 'string(uuid}' })
  spaceId: string;
  @ApiProperty()
  name: string;
}
