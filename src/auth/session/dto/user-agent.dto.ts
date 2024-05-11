import { ApiProperty } from '@nestjs/swagger';
import { UAParser } from 'ua-parser-js';

class NameWithVersionDto {
  @ApiProperty({ description: 'Название' })
  readonly name: string;

  @ApiProperty({ description: 'Версия' })
  readonly version: string;

  constructor(data: NameWithVersionDto);
  constructor(name: string, version: string);
  constructor(nameOrData: string | NameWithVersionDto, version?: string) {
    this.name = typeof nameOrData === 'string' ? nameOrData : nameOrData.name;
    this.version =
      typeof nameOrData === 'string' ? version : nameOrData.version;
  }
}

export class UserAgentDto {
  @ApiProperty({ description: 'Система', type: NameWithVersionDto })
  readonly system: NameWithVersionDto;

  @ApiProperty({ description: 'Браузер', type: NameWithVersionDto })
  readonly browser: NameWithVersionDto;

  @ApiProperty({
    description: 'Строка из заголовка user-agent',
  })
  readonly raw: string;

  constructor(userAgent: string) {
    const agent = UAParser(userAgent);

    this.system = new NameWithVersionDto(agent.os);
    this.browser = new NameWithVersionDto(agent.browser);
    this.raw = userAgent;
  }
}
