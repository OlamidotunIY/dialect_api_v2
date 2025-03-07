import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { PrismaService } from 'src/prisma.services';

@Module({
  providers: [TranslationService, PrismaService],
})
export class TranslationModule {}
