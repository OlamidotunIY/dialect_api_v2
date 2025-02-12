import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.services';
import { createStreamDto } from './dto';

@Injectable()
export class StreamService {
  constructor(private readonly prisma: PrismaService) {}

  async createStream(data: createStreamDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    return this.prisma.stream.create({
      data: {
        name: data.name,
        description: data.description,
        workspace: { connect: { id: data.workspaceId } },
      },
    });
  }

  async getStreams(workspaceId: string) {
    return this.prisma.stream.findMany({
      where: { workspaceId },
    });
  }

  async getStream(streamId: string) {
    return this.prisma.stream.findUnique({
      where: { id: streamId },
      include: {
        projects: true,
        streamMembers: true,
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

  async addStreamMember(streamId: string, userIds: string[]) {
    const stream = await this.prisma.stream.findUnique({
      where: { id: streamId },
    });

    if (!stream) {
      throw new BadRequestException('Stream not found');
    }

    // Prepare an array of data for bulk creation
    const streamMembersData = userIds.map((userId) => ({
      streamId: streamId,
      userId: userId,
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
      where: { streamId, userId },
    });

    if (!streamMember) {
      throw new Error('Stream member not found');
    }

    return this.prisma.streamMembers.delete({
      where: { id: streamMember.id },
    });
  }
}
