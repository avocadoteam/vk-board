import { Test, TestingModule } from '@nestjs/testing';
import { GoogleTasksService } from './google-tasks.service';

describe('GoogleTasksService', () => {
  let service: GoogleTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleTasksService],
    }).compile();

    service = module.get<GoogleTasksService>(GoogleTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
