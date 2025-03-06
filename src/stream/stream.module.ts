import { Module } from '@nestjs/common';
import { StreamResolver } from './stream.resolver';
import { StreamService } from './stream.service';
import { PrismaService } from 'src/prisma.services';
import { JwtService } from '@nestjs/jwt';
import { ChannelService } from 'src/channel/channel.service';
import { ActivitiesService } from 'src/activities/activities.service';

@Module({
  providers: [StreamResolver, StreamService, PrismaService, JwtService, ChannelService, ActivitiesService],
})
export class StreamModule {}
