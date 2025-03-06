import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.services';
import { createStreamDto } from './dto';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelType } from '@prisma/client';

@Injectable()
export class StreamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channel: ChannelService,
  ) {}

  async createStream(data: createStreamDto, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const stream = await this.prisma.stream.create({
      data: {
        name: data.name,
        description: data.description,
        workspace: { connect: { id: data.workspaceId } },
      },
    });

    const streamMember = await this.prisma.streamMembers.create({
      data: {
        User: {
          connect: {
            userId_workspaceId: {
              userId,
              workspaceId: data.workspaceId,
            },
          },
        },
        stream: {
          connect: { id: stream.id },
        },
      },
    });

    await this.channel.createChannel(
      data.workspaceId,
      stream.name,
      ChannelType.GROUP,
      stream.id,
      streamMember.id,
      userId,
    );

    return stream;
  }

  async getStreams(workspaceId: string, userId: string) {
    const recentProjects = await this.prisma.activity.findMany({
      where: {
        userId,
        projectId: { not: null }, // Ensure the activity is linked to a project
      },
      distinct: ['projectId'], // Ensure unique project IDs
      orderBy: {
        createdAt: 'desc', // Order by the most recent activity
      },
      take: 3, // Limit to 3 projects
      select: {
        projectId: true,
      },
    });

    const projectIds = recentProjects.map((activity) => activity.projectId);

    return this.prisma.stream.findMany({
      where: {
        workspaceId,
        streamMembers: {
          some: {
            User: {
              userId,
            },
          },
        },
      },
      include: {
        projects: {
          where: {
            id: { in: projectIds.length > 0 ? projectIds : undefined }, // Include all projects if no recent projects exist
          },
        },
        streamMembers: {
          include: {
            User: {
              include: {
                user: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async getStream(streamId: string) {
    return this.prisma.stream.findUnique({
      where: { id: streamId },
      include: {
        projects: true,
        streamMembers: {
          include: {
            User: true,
          },
        },
        Teams: {
          select: {
            name: true,
            members: true,
            id: true,
          },
        },
      },
    });
  }

  async addStreamMember(streamId: string, workspaceMemberIds: string[]) {
    const stream = await this.prisma.stream.findUnique({
      where: { id: streamId },
    });

    if (!stream) {
      throw new BadRequestException('Stream not found');
    }

    // Prepare an array of data for bulk creation
    const streamMembersData = workspaceMemberIds.map((userId) => ({
      streamId: streamId,
      workspaceMemberId: userId,
    }));

    // Use Prisma's `createMany` for bulk insertion
    await this.prisma.streamMembers.createMany({
      data: streamMembersData,
    });

    // Fetch and return the updated stream with members
    return await this.prisma.stream.findUnique({
      where: { id: streamId },
      include: {
        streamMembers: true,
      },
    });
  }

  async getStreamMembers(streamId: string) {
    return this.prisma.streamMembers.findMany({
      where: { streamId },
    });
  }

  async deleteStream(streamId: string) {
    return this.prisma.stream.delete({
      where: { id: streamId },
    });
  }

  async deleteStreamMember(streamId: string, userId: string) {
    const streamMember = await this.prisma.streamMembers.findFirst({
      where: {
        streamId,
        User: {
          userId,
        },
      },
    });

    if (!streamMember) {
      throw new Error('Stream member not found');
    }

    return this.prisma.streamMembers.delete({
      where: { id: streamMember.id },
    });
  }
}
