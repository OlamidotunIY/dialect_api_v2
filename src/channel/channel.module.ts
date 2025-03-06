import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { PrismaService } from 'src/prisma.services';
import { JwtService } from '@nestjs/jwt';
import { ActivitiesService } from 'src/activities/activities.service';

@Module({
  providers: [ChannelService, ChannelResolver, PrismaService, JwtService, ActivitiesService],
})
export class ChannelModule {}
