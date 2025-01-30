import { Test, TestingModule } from '@nestjs/testing';
import { StreamResolver } from './stream.resolver';

describe('StreamResolver', () => {
  let resolver: StreamResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamResolver],
    }).compile();

    resolver = module.get<StreamResolver>(StreamResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
