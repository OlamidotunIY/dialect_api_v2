import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { CreateTaskDto } from './dto';
import { ActivityType } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  private async addActivity(
    taskId: string,
    description: string,
    userId: string,
    type: ActivityType,
  ) {
    return this.prisma.activity.create({
      data: {
        type,
        description,
        task: { connect: { id: taskId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async createTask(data: CreateTaskDto, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    const existingTasks = await this.prisma.task.findMany({
      where: { projectId: data.projectId },
    });

    const taskUniqueName = `${project.name
      .toUpperCase()
      .replace(/\s/g, '')}-${existingTasks.length + 1}`;
    const initialBoard = await this.prisma.board.findFirst({
      where: {
        projectId: data.projectId,
      },
      include: {
        columns: {
          where: { isInitial: true },
        },
      },
    });

    let task: any;

    if (data.sprintId) {
      task = await this.prisma.card.create({
        data: {
          issue: {
            create: {
              key: taskUniqueName,
              description: data.description,
              Project: {
                connect: { id: data.projectId },
              },
              reporter: {
                connect: { id: userId },
              },
              status: {
                connect: {
                  id: initialBoard.columns[0].statusId,
                },
              },
            },
          },
          Column: {
            connect: {
              id: initialBoard.columns[0].id,
            },
          },
          sprint: {
            connect: {
              id: data.sprintId,
            },
          },
        },
      });
    } else {
      task = await this.prisma.card.create({
        data: {
          issue: {
            create: {
              key: taskUniqueName,
              description: data.description,
              Project: {
                connect: { id: data.projectId },
              },
              reporter: {
                connect: { id: userId },
              },
              status: {
                connect: {
                  id: initialBoard.columns[0].statusId,
                },
              },
              Activities: {
                create: {
                  type: ActivityType.TASK_CREATED,
                  description: `created a new task`,
                  user: {
                    connect: { id: userId },
                  },
                },
              },
            },
          },
          Column: {
            connect: {
              id: initialBoard.columns[0].id,
            },
          },
        },
      });
    }

    return task;
  }

  async getTasks(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
        dependencies: true,
        dependents: true,
        checklistItems: true,
        subtasks: true,
        parent: true,
        Project: true,
        Activities: true,
        status: true,
        reporter: true,
      },
    });
  }

  async getTask(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        dependencies: true,
        dependents: true,
        checklistItems: true,
        subtasks: true,
        parent: true,
        Project: true,
        Activities: true,
      },
    });
  }

  async updateTask(id: string, data: CreateTaskDto, userId: string) {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        description: data.description,
      },
    });

    await this.addActivity(
      task.id,
      `updated the task`,
      userId,
      ActivityType.TASK_UPDATED,
    );

    return task;
  }

  async deleteTask(id: string, userid: string) {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    await this.addActivity(
      task.id,
      `deleted the task ${task.key}`,
      userid,
      ActivityType.TASK_DELETED,
    );

    return task;
  }

  async addDependency(taskId: string, dependsOn: string, userId: string) {
    const dependancy = await this.prisma.dependency.create({
      data: {
        dependsOnTask: { connect: { id: dependsOn } },
        task: { connect: { id: taskId } },
      },
    });

    await this.addActivity(
      taskId,
      `added a dependency on task`,
      userId,
      ActivityType.TASK_ADD_DEPENDENCY,
    );

    return dependancy;
  }

  async removeDependency(id: string, userId: string) {
    const dependancy = await this.prisma.dependency.delete({
      where: { id },
    });

    await this.addActivity(
      dependancy.taskId,
      `removed dependency from task`,
      userId,
      ActivityType.TASK_REMOVE_DEPENDENCY,
    );

    return dependancy;
  }

  async addChecklistItem(taskId: string, description: string, userId: string) {
    const checkListitem = await this.prisma.checklistItem.create({
      data: {
        content: description,
        task: { connect: { id: taskId } },
      },
    });

    await this.addActivity(
      taskId,
      `added a checklist item to task`,
      userId,
      ActivityType.TASK_ADD_CHECKLIST_ITEM,
    );

    return checkListitem;
  }

  async markCheckListItemAsComplete(id: string, userId: string) {
    const checkListitem = await this.prisma.checklistItem.update({
      where: { id },
      data: {
        isDone: true,
      },
    });

    await this.addActivity(
      checkListitem.taskId,
      `marked a checklist item as complete`,
      userId,
      ActivityType.TASK_CHECK_CHECKLIST_ITEM,
    );

    return checkListitem;
  }

  async unMarkCheckListItemAsComplete(id: string, userId: string) {
    const checkListitem = await this.prisma.checklistItem.update({
      where: { id },
      data: {
        isDone: false,
      },
    });

    await this.addActivity(
      checkListitem.taskId,
      `unmarked a checklist item as complete`,
      userId,
      ActivityType.TASK_UNCHECK_CHECKLIST_ITEM,
    );

    return checkListitem;
  }

  async removeChecklistItem(id: string, userId: string) {
    await this.addActivity(
      id,
      `removed a checklist item from task`,
      userId,
      ActivityType.TASK_REMOVE_CHECKLIST_ITEM,
    );

    return this.prisma.checklistItem.delete({
      where: { id },
    });
  }

  async addSubtask(taskId: string, description: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { Project: true },
    });

    const existingSubTasks = await this.prisma.task.findMany({
      where: {
        parent: { id: taskId },
      },
    });

    const taskUniqueName = `${task.key}-${existingSubTasks.length + 1}`;
    const subTask = await this.prisma.task.create({
      data: {
        key: taskUniqueName,
        description,
        parent: { connect: { id: taskId } },
        reporter: { connect: { id: userId } },
      },
    });

    await this.addActivity(
      taskId,
      `created a new subtask in task ${task.key}`,
      userId,
      ActivityType.TASK_CREATE_SUBTASK,
    );

    return subTask;
  }

  async assignTask(taskId: string, userId: string, assignerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    await this.addActivity(
      taskId,
      `assigned task to "${user.fullname}"`,
      assignerId,
      ActivityType.TASK_ASSIGN_USER,
    );

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignee: {
          connect: { id: userId },
        },
      },
    });
  }

  async reassignTask(id: string, userId: string, assignerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    await this.addActivity(
      id,
      `reassigned task to "${user.fullname}"`,
      assignerId,
      ActivityType.TASK_REASSIGN_USER,
    );

    return this.prisma.task.update({
      where: { id },
      data: {
        assignee: {
          connect: { id: userId },
        },
      },
    });
  }

  async getSummary(projectId: string) {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAhead = new Date();
    sevenDaysAhead.setDate(now.getDate() + 7);

    const completedTasksCount = await this.prisma.task.count({
      where: {
        projectId: projectId,
        status: { name: 'Completed' }, // Adjust based on your status logic
        updatedAt: {
          gte: sevenDaysAgo,
          lte: now,
        },
      },
    });

    // Tasks due in the next 7 days
    const dueTasksCount = await this.prisma.task.count({
      where: {
        projectId: projectId,
        dueDate: {
          gte: now,
          lte: sevenDaysAhead,
        },
      },
    });

    // Tasks that are overdue
    const overdueTasksCount = await this.prisma.task.count({
      where: {
        projectId: projectId,
        dueDate: {
          lt: now,
        },
      },
    });

    // Task that are created in the last 7 days
    const newTasksCount = await this.prisma.task.count({
      where: {
        projectId: projectId,
        createdAt: {
          gte: sevenDaysAgo,
          lte: now,
        },
      },
    });

    // Task that are updated in the last 7 days
    const updatedTasksCount = await this.prisma.task.count({
      where: {
        projectId: projectId,
        updatedAt: {
          gte: sevenDaysAgo,
          lte: now,
        },
      },
    });

    const taskCountSummary = {
      completedTasksCount,
      dueTasksCount,
      overdueTasksCount,
      newTasksCount,
      updatedTasksCount,
    };

    const allStatuses = await this.prisma.status.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Status overview
    const statusOverview = await this.prisma.task.groupBy({
      by: ['statusId'], // Group by statusId
      where: {
        projectId: projectId,
      },
      _count: {
        statusId: true, // Count tasks for each status
      },
    });

    // Create a map of status counts from the `groupBy` result
    const statusCountMap = statusOverview.reduce((acc, status) => {
      acc[status.statusId] = status._count.statusId;
      return acc;
    }, {});

    // Enrich all statuses with the task count, defaulting to 0
    const enrichedStatusOverview = allStatuses.map((status) => ({
      statusName: status.name,
      taskCount: statusCountMap[status.id] || 0,
    }));

    const activities = await this.prisma.activity.findMany({
      where: {
        projectId,
        AND: {
          task: {
            projectId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return {
      taskCountSummary,
      statusOverview: enrichedStatusOverview,
      activities,
    };
  }
}
