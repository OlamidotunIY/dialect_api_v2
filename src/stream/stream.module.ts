import { Module } from '@nestjs/common';
import { StreamResolver } from './stream.resolver';

@Module({
  providers: [StreamResolver]
})
export class StreamModule {}
