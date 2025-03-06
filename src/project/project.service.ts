import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: createProjectDto) {
    const stream = await this.prisma.stream.findUnique({
      where: {
        workspaceId_name: {
          workspaceId: data.workspaceId,
          name: data.streamName,
        },
      },
    });

    if (!stream) {
      throw new BadRequestException('Stream not found');
    }

    const columns = [
      {
        name: 'To Do',
        isInitial: true,
      },
      {
        name: 'In Progress',
        isInitial: false,
      },
      {
        name: 'Done',
        isInitial: false,
      },
    ];

    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        stream: { connect: { id: stream.id } },
        Board: {
          create: {
            name: `${data.name} Board`,
            columns: {
              create: columns.map((column) => ({
                name: column.name,
                isInitial: column.isInitial,
                status: {
                  create: {
                    name: column.name,
                  },
                },
              })),
            },
          },
        },
        Sprints: {
          create: {
            name: `${data.name} Sprint`,
            position: 1,
          },
        },
      },
      include: {
        Board: {
          include: {
            columns: {
              include: {
                status: true,
              },
            },
          },
        },
      },
    });

    await Promise.all(
      project.Board.columns.map((column) => {
        return this.prisma.status.update({
          where: {
            id: column.status.id,
          },
          data: {
            Project: {
              connect: {
                id: project.id,
              },
            },
          },
        });
      }),
    );

    return project;
  }

  async getProjects(streamName: string, workspaceId: string) {
    return this.prisma.project.findMany({
      where: {
        stream: {
          name: streamName,
          workspaceId,
        },
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            members: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    });
  }

  async getProjectById(projectId: string) {
    return this.prisma.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          include: {
            assignee: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            members: {
              include: {
                User: true,
              },
            },
          },
        },
      },
    });
  }

  async updateProject(
    workspaceId: string,
    streamName: string,
    projectName: string,
    data: createProjectDto,
  ) {
    const stream = await this.prisma.stream.findUnique({
      where: { workspaceId_name: { workspaceId, name: streamName } },
    });

    if (!stream) {
      throw new Error('Stream not found in the specified workspace');
    }

    return this.prisma.project.update({
      where: {
        streamId_name: {
          streamId: stream.id,
          name: projectName,
        },
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async deleteProject(
    workspaceId: string,
    streamName: string,
    projectName: string,
  ) {
    const stream = await this.prisma.stream.findUnique({
      where: { workspaceId_name: { workspaceId, name: streamName } },
    });

    if (!stream) {
      throw new Error('Stream not found in the specified workspace');
    }

    return this.prisma.project.delete({
      where: {
        streamId_name: {
          streamId: stream.id,
          name: projectName,
        },
      },
    });
  }

  async assignProjectToTeam(
    workspaceId: string,
    streamName: string,
    projectName: string,
    teamId: string,
  ) {
    const stream = await this.prisma.stream.findUnique({
      where: { workspaceId_name: { workspaceId, name: streamName } },
    });

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!stream || !team) {
      throw new Error('Stream or Team not found');
    }

    return this.prisma.project.update({
      where: {
        streamId_name: {
          streamId: stream.id,
          name: projectName,
        },
      },
      data: {
        team: { connect: { id: team.id } },
      },
    });
  }

  async removeProjectFromTeam(
    workspaceId: string,
    streamName: string,
    projectName: string,
  ) {
    const stream = await this.prisma.stream.findUnique({
      where: { workspaceId_name: { workspaceId, name: streamName } },
    });

    if (!stream) {
      throw new Error('Stream not found in the specified workspace');
    }

    return this.prisma.project.update({
      where: {
        streamId_name: {
          streamId: stream.id,
          name: projectName,
        },
      },
      data: {
        team: { disconnect: true },
      },
    });
  }
}
