import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { Activity } from './activities.types';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { createActivityDto } from './dto';

@Resolver()
export class ActivitiesResolver {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // Queries
  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Activity])
  async activities(@Args('userId') userId: string) {
    return this.activitiesService.getActivities(userId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Query(() => Activity)
  async getProjectActivities(@Args('projectId') projectId: string) {
    return this.activitiesService.getProjectActivities(projectId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Query(() => Activity)
  async getStreamActivities(@Args('streamId') streamId: string) {
    return this.activitiesService.getStreamActivities(streamId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Query(() => Activity)
  async getWorkspaceActivities(@Args('workspaceId') workspaceId: string) {
    return this.activitiesService.getWorkspaceActivities(workspaceId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Query(() => Activity)
  async getTaskActivities(@Args('taskId') taskId: string) {
    return this.activitiesService.getTaskActivities(taskId);
  }
}
