import { Test, TestingModule } from '@nestjs/testing';
import { RestricitionsService } from './restricitions.service';

describe('RestricitionsService', () => {
  let service: RestricitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestricitionsService],
    }).compile();

    service = module.get<RestricitionsService>(RestricitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
