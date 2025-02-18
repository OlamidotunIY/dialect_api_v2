import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from './team.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { PermissionsGuard } from 'src/workspace/graphql-permission.guard';
import { Permissions } from 'src/permission/permissions.decorator';
import { ResourceType } from '@prisma/client';
import { Team } from './team.types';
import { createTeamDto } from './dto';

@Resolver()
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    { name: 'create', value: true, resourceType: ResourceType.TEAM },
  ])
  @Mutation(() => Team)
  async createTeam(@Args('data') data: createTeamDto) {
    return this.teamService.createTeam(data);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([{ name: 'read', value: true, resourceType: ResourceType.TEAM }])
  @Query(() => [Team])
  async getTeams(@Args('streamId') streamId: string) {
    return this.teamService.getTeams(streamId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([{ name: 'read', value: true, resourceType: ResourceType.TEAM }])
  @Query(() => Team)
  async getTeam(@Args('teamId') teamId: string) {
    return this.teamService.getTeam(teamId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    {
      name: 'add-members',
      value: true,
      resourceType: ResourceType.TEAM,
    },
  ])
  @Mutation(() => Team)
  async addMemberToTeam(
    @Args('teamId') teamId: string,
    @Args('userId') userId: string,
  ) {
    return this.teamService.addMemberToTeam(teamId, userId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    {
      name: 'delete',
      value: true,
      resourceType: ResourceType.TEAM,
    },
  ])
  @Mutation(() => Team)
  async deleteTeam(@Args('teamId') teamId: string) {
    return this.teamService.deleteTeam(teamId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard, PermissionsGuard)
  @Permissions([
    {
      name: 'remove-member',
      value: true,
      resourceType: ResourceType.TEAM,
    },
  ])
  @Mutation(() => Team)
  async removeMemberFromTeam(
    @Args('teamId') teamId: string,
    @Args('userId') userId: string,
  ) {
    return this.teamService.removeMemberFromTeam(teamId, userId);
  }
}
