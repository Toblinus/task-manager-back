import { Controller, Get, Query } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatorResponseDto } from './dto/validator-response.dto';

@ApiTags('Validator')
@Controller('validator')
export class ValidatorController {
  constructor(private validatorService: ValidatorService) {}

  @ApiTags('PublicApi')
  @ApiResponse({
    status: 200,
    description: 'Результат валидации',
    type: ValidatorResponseDto,
  })
  @ApiOperation({ summary: 'Проверка на корректность имени пользователя' })
  @Get('/login')
  validateLogin(@Query('value') value: string) {
    return this.validatorService.validateLogin(value);
  }
}
