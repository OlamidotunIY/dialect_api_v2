import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createActivityDto } from './dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivities(userId: string) {
    return this.prisma.activity.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async createActivity(data: createActivityDto) {
    return this.prisma.activity.create({
      data: {
        description: data.description,
        type: data.type,
        user: {
          connect: {
            id: data.userId,
          },
        },
        ...(data.streamId && {
          stream: {
            connect: {
              id: data.streamId,
            },
          },
        }),
        ...(data.projectId && {
          project: {
            connect: {
              id: data.projectId,
            },
          },
        }),
        ...(data.workspaceId && {
          workspace: {
            connect: {
              id: data.workspaceId,
            },
          },
        }),
        ...(data.taskId && {
          task: {
            connect: {
              id: data.taskId,
            },
          },
        }),
        ...(data.channelId && {
          channel: {
            connect: {
              id: data.channelId,
            },
          },
        })
      },
    });
  }

  async getProjectActivities(projectId: string) {
    return this.prisma.activity.findMany({
      where: {
        projectId,
      },
      include: {
        user: true,
      },
    });
  }

  async getWorkspaceActivities(workspaceId: string) {
    return this.prisma.activity.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: true,
      },
    });
  }

  async getStreamActivities(streamId: string) {
    return this.prisma.activity.findMany({
      where: {
        streamId,
      },
      include: {
        user: true,
      },
    });
  }

  async getTaskActivities(taskId: string) {
    return this.prisma.activity.findMany({
      where: {
        taskId,
      },
      include: {
        user: true,
      },
    });
  }
}
