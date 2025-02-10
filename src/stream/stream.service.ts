import { Injectable } from '@nestjs/common';
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
      throw new Error('Workspace not found');
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

  async addMemberToStream(streamId: string, userId: string[]) {
    const stream = await this.prisma.stream.findUnique({
      where: { id: streamId },
    });

    if (!stream) {
      throw new Error('Stream not found');
    }

    for (const id of userId) {
      await this.prisma.streamMembers.create({
        data: {
          stream: { connect: { id: streamId } },
          user: { connect: { id } },
        },
      });
    }

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
