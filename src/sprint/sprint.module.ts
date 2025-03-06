import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintResolver } from './sprint.resolver';
import { PrismaService } from 'src/prisma.services';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [SprintService, SprintResolver, PrismaService, JwtService, JwtModule]
})
export class SprintModule {}
