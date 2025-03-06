import { Module } from '@nestjs/common';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma.services';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BoardService } from 'src/board/board.service';

@Module({
  providers: [TaskResolver, TaskService, PrismaService, JwtService, JwtModule, BoardService],
})
export class TaskModule {}
