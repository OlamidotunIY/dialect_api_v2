import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma.services';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [TaskResolver, TaskService, PrismaService, JwtService, JwtModule],
})
export class TaskModule {}
