import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createStreamDto } from './dto';
import { ChannelType } from '@prisma/client';

@Injectable()
export class StreamService {
  constructor(private readonly prisma: PrismaService) {}

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
        channel: {
          create: {
            name: data.name,
            type: ChannelType.GROUP,
            members: {
              create: {
                user: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
            workspace: {
              connect: {
                id: data.workspaceId,
              },
            },
          },
        },
        streamMembers: {
          create: {
            workspaceMemberId: data.workspaceId,
          },
        },
      },
    });

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
    const streamMembersData = workspaceMemberIds.map(async (userId) => ({
      streamId: streamId,
      workspaceMember: await this.prisma.workspaceMember.findFirst({
        where: {
          id: userId,
        },
      }),
    }));

    const streamChannel = await this.prisma.channel.findFirst({
      where: {
        streamId,
      },
      include: {
        members: {
          include: {
            user: true,
            channel: true,
          },
        },
      },
    });

    const channelMembersData = streamChannel.members.map((member) => ({
      userId: member.user.id,
      workspaceId: member.channel.workspaceId,
    }));

    // Use Prisma's `createMany` for bulk insertion
    for (const data of streamMembersData) {
      await this.prisma.streamMember.create({
        data: {
          stream: {
            connect: {
              id: streamId,
            },
          },
          User: {
            connect: {
              userId_workspaceId: {
                userId: (await data).workspaceMember.id,
                workspaceId: stream.workspaceId,
              },
            },
          },
        },
      });

      await this.prisma.channelMember.create({
        data: {
          user: {
            connect: {
              id: (await data).workspaceMember.userId,
            },
          },
          channel: {
            connect: {
              id: streamChannel.id,
            },
          },
          channelSetting: {
            create: {
              channel: {
                connect: {
                  id: streamChannel.id,
                },
              },
            },
          },
        },
      });

      for (const channelData of channelMembersData) {
        const existingDirectChannel = await this.prisma.channel.findFirst({
          where: {
            workspaceId: channelData.workspaceId,
            type: ChannelType.DIRECT,
            members: {
              every: {
                OR: [
                  {
                    userId: channelData.userId,
                  },
                  {
                    userId: (await data).workspaceMember.userId,
                  },
                ],
              },
            },
          },
        });

        if (!existingDirectChannel) {
          await this.prisma.channel.create({
            data: {
              name: `${channelData.userId}-${(await data).workspaceMember.userId}`,
              type: ChannelType.DIRECT,
              workspace: {
                connect: {
                  id: channelData.workspaceId,
                },
              },
              members: {
                create: [
                  {
                    user: {
                      connect: {
                        id: channelData.userId,
                      },
                    },
                  },
                  {
                    user: {
                      connect: {
                        id: (await data).workspaceMember.userId,
                      },
                    },
                  },
                ],
              },
              channelSettings: {
                create: [
                  {
                    userId: channelData.userId,
                  },
                  {
                    userId: (await data).workspaceMember.userId,
                  },
                ],
              },
            },
          });
        }
      }
    }

    // Fetch and return the updated stream with members
    return await this.prisma.stream.findUnique({
      where: { id: streamId },
      include: {
        streamMembers: true,
      },
    });
  }

  async getStreamMembers(streamId: string) {
    return this.prisma.streamMember.findMany({
      where: { streamId },
    });
  }

  async deleteStream(streamId: string) {
    return this.prisma.stream.delete({
      where: { id: streamId },
    });
  }

  async deleteStreamMember(streamId: string, userId: string) {
    const streamMember = await this.prisma.streamMember.findFirst({
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

    return this.prisma.streamMember.delete({
      where: { id: streamMember.id },
    });
  }
}
