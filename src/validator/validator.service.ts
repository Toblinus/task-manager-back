import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  ValidatorResponseDto,
  ValidatorResponseErrorCode,
} from './dto/validator-response.dto';

@Injectable()
export class ValidatorService {
  constructor(private db: PrismaService) {}

  async validateLogin(value: string): Promise<ValidatorResponseDto> {
    const user = await this.db.user.findFirst({
      where: {
        username: value,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      return ValidatorResponseDto.createErrorResult(
        ValidatorResponseErrorCode.ALREADY_EXISTS,
      );
    }

    return ValidatorResponseDto.createDoneResult();
  }
}
