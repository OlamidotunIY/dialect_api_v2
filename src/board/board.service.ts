import { Injectable } from '@nestjs/common';
import { SprintState } from '@prisma/client';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async getBoard(projectId: string) {
    const board = await this.prisma.board.findUnique({
      where: { projectId },
      include: {
        columns: {
          include: {
            cards: {
              where: {
                sprint: {
                  state: SprintState.Active,
                },
              },
              include: {
                issue: {
                  include: {
                    status: true,
                    assignee: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return board;
  }

  async getBacklogData(projectId: string) {
    const backlog = await this.prisma.card.findMany({
      where: {
        projectId,
        sprintId: null,
      },
      include: {
        issue: {
          include: {
            status: true,
            assignee: true,
          },
        },
      },
    });

    const sprints = await this.prisma.sprint.findMany({
      where: {
        projectId,
      },
      include: {
        cards: {
          include: {
            issue: true,
          },
        },
      },
    });

    return {
      sprints,
      backlog,
    };
  }
}
