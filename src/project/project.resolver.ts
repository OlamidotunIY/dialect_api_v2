import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { createProjectDto } from './dto';
import { Project } from './project.types';
import { Permissions } from 'src/permission/permissions.decorator';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { PermissionsGuard } from 'src/workspace/graphql-permission.guard';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { ResourceType } from '@prisma/client';

@UseFilters(GraphQLErrorFilter)
@UseGuards(GraphqlAuthGuard, PermissionsGuard)
@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  // Mutaions
  @Permissions([
    { name: 'create', value: true, resourceType: ResourceType.PROJECT },
  ])
  @Mutation(() => Project)
  async createProject(@Args('data') data: createProjectDto) {
    return this.projectService.createProject(data);
  }

  // Queries
  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.PROJECT },
  ])
  @Query(() => [Project])
  async projects(
    @Args('streamName') streamName: string,
    @Args('workspaceId') workspaceId: string,
  ) {
    return this.projectService.getProjects(streamName, workspaceId);
  }

  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.PROJECT },
  ])
  @Query(() => Project)
  async project(@Args('projectId') projectId: string) {
    return this.projectService.getProjectById(projectId);
  }
}
