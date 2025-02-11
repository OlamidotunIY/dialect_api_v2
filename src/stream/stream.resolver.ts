import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { Stream } from './stream.types';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { PermissionsGuard } from 'src/workspace/graphql-permission.guard';
import { Permissions } from 'src/permission/permissions.decorator';
import { ResourceType } from '@prisma/client';
import { createStreamDto } from './dto';
import { Request } from 'express';

@Resolver()
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'create', value: true, resourceType: ResourceType.STREAM },
  ])
  @Mutation(() => Stream)
  async createStream(@Args('data') data: createStreamDto) {
    // implementation
    return this.streamService.createStream(data);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.STREAM },
  ])
  @Query(() => [Stream])
  async getStreams(@Args('workspaceId') workspaceId: string) {
    // implementation
    return this.streamService.getStreams(workspaceId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'delete', value: true, resourceType: ResourceType.STREAM },
  ])
  @Mutation(() => Stream)
  async deleteStream(@Args('id') id: string) {
    // implementation
    return this.streamService.deleteStream(id);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'add-members', value: true, resourceType: ResourceType.STREAM },
  ])
  @Mutation(() => Stream)
  async addMembersToStream(
    @Args('streamId') streamId: string,
    @Args('userIds') userIds: string[],
  ) {
    // implementation
    return this.streamService.addStreamMember(streamId, userIds);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'remove-member', value: true, resourceType: ResourceType.STREAM },
  ])
  @Mutation(() => Stream)
  async removeMemberFromStream(
    @Args('streamId') streamId: string,
    @Context() context: { req: Request },
  ) {
    // implementation
    return this.streamService.deleteStreamMember(
      streamId,
      context.req.user.sub,
    );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.STREAM },
  ])
  @Query(() => Stream)
  async getStream(@Args('streamId') streamId: string) {
    // implementation
    return this.streamService.getStream(streamId);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(PermissionsGuard)
  @Permissions([
    { name: 'read', value: true, resourceType: ResourceType.STREAM },
  ])
  @Query(() => [Stream])
  async getStreamMembers(@Args('streamId') streamId: string) {
    // implementation
    return this.streamService.getStreamMembers(streamId);
  }
}
