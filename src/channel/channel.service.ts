import { Injectable } from '@nestjs/common';
import { ActivityType, ChannelType } from '@prisma/client';
import { ActivitiesService } from 'src/activities/activities.service';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activities: ActivitiesService,
  ) {}

  async getChannels(workspaceId: string) {
    return this.prisma.channel.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async getChannelById(id: string) {
    return this.prisma.channel.findUnique({
      where: {
        id,
      },
    });
  }

  async createChannel(
    workspaceId: string,
    name: string,
    type: ChannelType,
    streamId: string,
    streamMemberId: string,
    userId: string,
  ) {
    const channel = await this.prisma.channel.create({
      data: {
        name,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        type,
        Stream: {
          connect: {
            id: streamId,
          },
        },
      },
    });

    await this.prisma.channelMembers.create({
      data: {
        user: {
          connect: {
            id: streamMemberId,
          },
        },
        channel: {
          connect: {
            id: channel.id,
          },
        },
      },
    });

    await this.activities.createActivity({
      channelId: channel.id,
      description: `Created a new channel`,
      type: ActivityType.CHANNEL_CREATED,
      userId,
      workspaceId,
    });

    return channel;
  }
}
