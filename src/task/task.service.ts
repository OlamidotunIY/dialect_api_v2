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

    const taskUniqueName = `${project.name.toUpperCase()}-${existingTasks.length + 1}`;
    const task = await this.prisma.task.create({
      data: {
        key: taskUniqueName,
        description: data.description,
        project: {
          connect: { id: data.projectId },
        },
        reporter: {
          connect: { id: userId },
        },
      },
    });

    await this.addActivity(
      task.id,
      `created a new task`,
      userId,
      ActivityType.TASK_CREATED,
    );

    return task;
  }

  async getTasks(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignedUsers: true,
        dependencies: true,
        dependents: true,
        checklistItems: true,
        subtasks: true,
        parent: true,
        project: true,
        Activities: true,
      },
    });
  }

  async getTask(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedUsers: true,
        dependencies: true,
        dependents: true,
        checklistItems: true,
        subtasks: true,
        parent: true,
        project: true,
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
      include: { project: true },
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

    return this.prisma.taskAssignment.create({
      data: {
        task: { connect: { id: taskId } },
        user: { connect: { id: assignerId } },
      },
    });
  }

  async unassignTask(id: string, userId: string) {
    const taskAssignment = await this.prisma.taskAssignment.findUnique({
      where: { id },
      include: { user: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: taskAssignment.userId },
    });

    await this.addActivity(
      id,
      `unassigned task from "${user.fullname}"`,
      userId,
      ActivityType.TASK_UNASSIGN_USER,
    );

    return this.prisma.taskAssignment.delete({
      where: { id },
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

    return this.prisma.taskAssignment.update({
      where: { id },
      data: {
        user: { connect: { id: userId } },
      },
    });
  }
}
