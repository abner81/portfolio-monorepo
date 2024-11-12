import { Test, TestingModule } from '@nestjs/testing';
import { AddProtectionPlanController } from './add-protection-plan.controller';

describe('AddProtectionPlanController', () => {
  let controller: AddProtectionPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddProtectionPlanController],
    }).compile();

    controller = module.get<AddProtectionPlanController>(
      AddProtectionPlanController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
