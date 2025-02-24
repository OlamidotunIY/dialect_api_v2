import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { TaskService } from './task.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { ChecklistItem, Dependency, Task } from './task.types';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { PermissionsGuard } from 'src/workspace/graphql-permission.guard';
import { Permissions } from 'src/permission/permissions.decorator';
import { ResourceType } from '@prisma/client';
import { CreateTaskDto } from './dto';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ProjectService } from 'src/project/project.service';

@Resolver()
export class TaskResolver {
  public pubSub: RedisPubSub;
  constructor(
    private readonly taskService: TaskService,
  ) {
    this.pubSub = new RedisPubSub();
  }

  // Queries

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([{ name: 'read', value: true, resourceType: ResourceType.TASK }])
  @Query(() => [Task])
  async getTasks(@Args('projectId') projectId: string) {
    return this.taskService.getTasks(projectId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([{ name: 'read', value: true, resourceType: ResourceType.TASK }])
  @Query(() => Task)
  async task(@Args('id') id: string) {
    return this.taskService.getTask(id);
  }

  // Mutations

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'create', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async createTask(
    @Args('data') data: CreateTaskDto,
    @Context() context: { req: Request },
  ) {
    return this.taskService.createTask(data, context.req.user.sub);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async updateTask(
    @Args('id') id: string,
    @Args('data') data: CreateTaskDto,
    @Context() context: { req: Request },
  ) {
    return this.taskService.updateTask(id, data, context.req.user.sub);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'delete', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async deleteTask(
    @Args('id') id: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.deleteTask(id, context.req.user.sub);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Dependency)
  async addDependency(
    @Args('taskId') taskId: string,
    @Args('dependsOn') dependsOn: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.addDependency(
      taskId,
      dependsOn,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Dependency)
  async removeDependency(
    @Args('id') id: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.removeDependency(id, context.req.user.sub);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => ChecklistItem)
  async addChecklistItem(
    @Args('taskId') taskId: string,
    @Args('description') description: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.addChecklistItem(
      taskId,
      description,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => ChecklistItem)
  async removeChecklistItem(
    @Args('id') id: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.removeChecklistItem(id, context.req.user.sub);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => ChecklistItem)
  async markCheckListItemAsComplete(
    @Args('id') id: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.markCheckListItemAsComplete(
      id,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => ChecklistItem)
  async markCheckListItemAsIncomplete(
    @Args('id') id: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.unMarkCheckListItemAsComplete(
      id,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async createSubTask(
    @Args('taskId') taskId: string,
    @Args('description') description: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.addSubtask(
      taskId,
      description,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async assignTask(
    @Args('taskId') taskId: string,
    @Args('assigneeId') assigneeId: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.assignTask(
      taskId,
      assigneeId,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async unAssignTask(
    @Args('taskId') taskId: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.unassignTask(taskId, context.req.user.sub);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.TASK },
  ])
  @Mutation(() => Task)
  async reassignTask(
    @Args('taskId') taskId: string,
    @Args('assigneeId') assigneeId: string,
    @Context() context: { req: Request },
  ) {
    return this.taskService.reassignTask(
      taskId,
      assigneeId,
      context.req.user.sub,
    );
  }

  // Subscriptions

//   @Subscription((returns) => Task, {
//     nullable: true,
//     resolve: (value) => value.newTask,
//     filter: async (payload, variables, context) => {
//         const { userId } = context; // Extract the user ID from context
//         const task = payload.newTask; // Task data published to the subscription

//         // Fetch the project details
//         const project = await this.prisma.project.findUnique({
//           where: { id: task.projectId },
//           include: { team: true, stream: true }, // Include team and stream details
//         });

//         if (!project) {
//           return false; // If the project doesn't exist, ignore the event
//         }

//         // Check if the project has a team
//         if (project.team) {
//           // Verify if the user is a member of the team
//           const isTeamMember = await this.prisma.teamMember.findFirst({
//             where: { userId, teamId: project.team.id },
//           });
//           return Boolean(isTeamMember);
//         }

//         // If no team is assigned, check if the user is a stream member
//         const isStreamMember = await this.prisma.streamMember.findFirst({
//           where: { userId, streamId: project.stream.id },
//         });
//         return Boolean(isStreamMember);
//       },
//   })
//   newTask() {
//     return this.pubSub.asyncIterator('newTask');
//   }
}
