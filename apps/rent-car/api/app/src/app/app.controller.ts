import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { BaseController } from '@monorepo/arch/controller';
import { AppService } from './app.service';

@Controller()
export class AppController extends BaseController<{ message: string }> {
  constructor(private readonly appService: AppService) {
    super();
  }

  @Get()
  async handle(@Res() res: Response): Promise<{ message: string }> {
    return this.appService.getData();
  }
}
