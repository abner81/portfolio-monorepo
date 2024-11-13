import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseController } from '@monorepo/arch/controller';
import {
  RentCarApiApplicationService,
  IRentCarApiApplicationService,
} from 'rent-car/api/application';
import { ADD_PROTECTION_PLAN_SERVICE } from './config/constants';

@Controller('')
export class AppController extends BaseController {
  constructor(
    @Inject(ADD_PROTECTION_PLAN_SERVICE)
    private readonly service: RentCarApiApplicationService
  ) {
    super();
  }

  @Get('')
  async handle(@Req() req: Request, @Res() res: Response): Promise<void> {
    return await this.service.execute();
  }
}
