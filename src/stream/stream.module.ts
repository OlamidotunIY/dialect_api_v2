import { Module } from '@nestjs/common';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';
import { PrismaService } from 'src/prisma.services';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [StreamResolver, StreamService, PrismaService, JwtService],
})
export class StreamModule {}
