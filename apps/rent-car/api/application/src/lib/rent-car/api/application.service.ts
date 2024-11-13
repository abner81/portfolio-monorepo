import { Inject, Injectable } from '@nestjs/common';
import { IApplicationService } from '@monorepo/arch/service';

@Injectable()
export class RentCarService implements IApplicationService {
  constructor(
    @Inject(RENT_CAR_REPOSITORY)
    private readonly repo: IRentCarRepository
  ) {}

  async execute(params: unknown): Promise<void> {
    return;
  }
}
