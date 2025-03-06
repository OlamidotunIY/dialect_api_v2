import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { PrismaService } from 'src/prisma.services';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [BoardService, PrismaService, JwtService],
})
export class BoardModule {}
