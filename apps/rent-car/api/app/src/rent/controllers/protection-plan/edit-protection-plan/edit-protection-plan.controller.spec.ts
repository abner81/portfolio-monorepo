import { Test, TestingModule } from '@nestjs/testing';
import { EditProtectionPlanController } from './edit-protection-plan.controller';

describe('EditProtectionPlanController', () => {
  let controller: EditProtectionPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditProtectionPlanController],
    }).compile();

    controller = module.get<EditProtectionPlanController>(
      EditProtectionPlanController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
