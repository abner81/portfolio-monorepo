import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { BaseController } from '@monorepo/arch/controller';
import { RentCarApiApplicationService } from 'rent-car/api/application';

@Controller()
export class AppController extends BaseController<{ message: string }> {
  constructor(private readonly service: RentCarApiApplicationService) {
    super();
  }

  @Get()
  async handle(@Res() res: Response): Promise<{ message: string }> {
    return { message: 's' };
  }
}
