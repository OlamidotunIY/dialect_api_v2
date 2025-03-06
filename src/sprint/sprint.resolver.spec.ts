import { Test, TestingModule } from '@nestjs/testing';
import { SprintResolver } from './sprint.resolver';

describe('SprintResolver', () => {
  let resolver: SprintResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SprintResolver],
    }).compile();

    resolver = module.get<SprintResolver>(SprintResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
