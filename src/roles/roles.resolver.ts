import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from './roles.type';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { PermissionsGuard } from 'src/workspace/graphql-permission.guard';
import { Permissions } from 'src/permission/permissions.decorator';
import { ResourceType } from '@prisma/client';
import { createRolesDto } from './dto';

@Resolver()
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.WORKSPACE },
  ])
  @Mutation(() => Role)
  async createRole(
    @Args('data') data: createRolesDto,
    @Args('workspaceId') workspaceId: string,
  ) {
    return this.rolesService.createRoles(workspaceId, data);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.WORKSPACE },
  ])
  @Query(() => [Role])
  async roles(@Args('workspaceId') workspaceId: string) {
    return this.rolesService.getRoles(workspaceId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.WORKSPACE },
  ])
  @Query(() => Role)
  async role(@Args('id') id: string) {
    return this.rolesService.getRole(id);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'update', value: true, resourceType: ResourceType.WORKSPACE },
  ])
  @Mutation(() => Role)
  async updateRole(@Args('id') id: string, @Args('data') data: createRolesDto) {
    return this.rolesService.updateRole(id, data);
  }
}
