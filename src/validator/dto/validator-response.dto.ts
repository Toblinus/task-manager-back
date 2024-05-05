import { ApiProperty } from '@nestjs/swagger';

export enum ValidatorResponseErrorCode {
  ALREADY_EXISTS = 'already_exists',
}

export class ValidatorResponseDto {
  @ApiProperty({ description: 'Данные валидны' })
  public readonly isValid: boolean;

  @ApiProperty({
    description: 'Код ошибки валидации',
    enum: ValidatorResponseErrorCode,
  })
  public readonly errorCode: ValidatorResponseErrorCode | null;

  constructor(errorCode: ValidatorResponseErrorCode | null = null) {
    this.isValid = !errorCode;
    this.errorCode = errorCode || null;
  }

  static createDoneResult() {
    return new this();
  }

  static createErrorResult(errorCode: ValidatorResponseErrorCode) {
    return new this(errorCode);
  }
}
