import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { PrismaService } from 'src/prisma.services';
import { TranslationService } from 'src/translation/translation.service';

@Module({
  providers: [MessageService, MessageResolver, PrismaService, TranslationService],
})
export class MessageModule {}
