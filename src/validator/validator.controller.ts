import { Controller, Get, Query } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidatorResponseDto } from './dto/validator-response.dto';

@Controller('validator')
export class ValidatorController {
  constructor(private validatorService: ValidatorService) {}

  @ApiTags('Валидатор')
  @ApiResponse({
    status: 200,
    description: 'Результат валидации',
    type: ValidatorResponseDto,
  })
  @Get('/login')
  validateLogin(@Query('value') value: string) {
    return this.validatorService.validateLogin(value);
  }
}
