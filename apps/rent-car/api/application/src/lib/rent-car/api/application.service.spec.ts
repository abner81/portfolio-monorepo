import { Test } from '@nestjs/testing';
import { RentCarApiApplicationService } from './application.service';

describe('RentCarApiApplicationService', () => {
  let service: RentCarApiApplicationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RentCarApiApplicationService],
    }).compile();

    service = module.get(RentCarApiApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
