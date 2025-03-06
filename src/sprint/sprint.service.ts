import { Injectable } from '@nestjs/common';
import { SprintState } from '@prisma/client';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class SprintService {
  constructor(private readonly prisma: PrismaService) {}

  async getSprints(projectId: string) {
    return this.prisma.sprint.findMany({
      where: {
        projectId,
      },
    });
  }

  async getSprintById(id: string) {
    return this.prisma.sprint.findUnique({
      where: {
        id,
      },
    });
  }

  async createSprint(projectId: string, name: string) {
    const previousSprint = await this.prisma.sprint.findFirst({
      where: {
        projectId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
    return this.prisma.sprint.create({
      data: {
        name,
        project: {
          connect: {
            id: projectId,
          },
        },
        position: previousSprint ? previousSprint.position + 1 : 0,
      },
    });
  }

  async startSprint(id: string) {
    return this.prisma.sprint.update({
      where: {
        id,
      },
      data: {
        state: SprintState.Active,
      },
    });
  }

  async completeSprint(id: string) {
    return this.prisma.sprint.update({
      where: {
        id,
      },
      data: {
        state: SprintState.Completed,
      },
    });
  }

  async deleteSprint(id: string) {
    return this.prisma.sprint.delete({
      where: {
        id,
      },
    });
  }

  async updateSprint(
    id: string,
    name: string,
    goal: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.sprint.update({
      where: {
        id,
      },
      data: {
        name,
        goal,
        startDate,
        endDate,
      },
    });
  }

  async moveCardToSprint(cardId: string, sprintId: string) {
    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        sprint: true,
      },
    });

    if (card.sprint) {
      await this.prisma.card.update({
        where: {
          id: cardId,
        },
        data: {
          sprint: {
            disconnect: true,
          },
        },
      });
    }

    return this.prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        sprint: {
          connect: {
            id: sprintId,
          },
        },
      },
    });
  }
}
