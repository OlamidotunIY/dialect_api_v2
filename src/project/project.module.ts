import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { PrismaService } from 'src/prisma.services';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ProjectResolver, ProjectService, PrismaService, JwtService],
})
export class ProjectModule {}
