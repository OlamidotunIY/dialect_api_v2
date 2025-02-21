import { Module } from '@nestjs/common';
import { ActivitiesResolver } from './activities.resolver';
import { ActivitiesService } from './activities.service';
import { PrismaService } from 'src/prisma.services';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  providers: [ActivitiesResolver, ActivitiesService, PrismaService, JwtModule, JwtService]
})
export class ActivitiesModule {}
