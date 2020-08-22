import { Test, TestingModule } from '@nestjs/testing';
import { GoogleTasksController } from './google-tasks.controller';

describe('GoogleTasks Controller', () => {
  let controller: GoogleTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleTasksController],
    }).compile();

    controller = module.get<GoogleTasksController>(GoogleTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
