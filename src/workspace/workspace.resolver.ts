import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { WorkspaceService } from './workspace.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { Workspace } from './workspace.type';
import { Request } from 'express';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { addMemberDto, inviteMembersDto } from './dto';

@Resolver()
export class WorkspaceResolver {
  constructor(
    private readonly workspaceService: WorkspaceService,
    // private readonly rolesService: RolesService,
    // private readonly permissionService: PermissionService,
  ) {}

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', 'images', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Workspace)
  async createWorkspace(
    @Args('name') name: string,
    @Context() context: { req: Request },
    @Args('logo', { type: () => GraphQLUpload, nullable: true })
    logo: GraphQLUpload.FileUpload,
  ) {
    if (logo) {
      const imagePath = await this.storeImageAndGetUrl(logo);
      return this.workspaceService.createWorkspace(
        name,
        context.req.user.sub,
        imagePath,
      );
    } else
      return this.workspaceService.createWorkspace(
        name,
        context.req.user.sub,
        null,
      );
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Workspace)
  async updateWorkspace(
    @Args('id') id: string,
    @Args('description', { nullable: true }) description: string,
    @Args('teamSize', { nullable: true }) teamSize: number,
    @Args('inviteLinkActive', { nullable: true }) inviteLinkActive: boolean,
    @Args('aiEnabled', { nullable: true }) aiEnabled: boolean,
    @Args('logo', { type: () => GraphQLUpload, nullable: true })
    logo: GraphQLUpload.FileUpload,
    @Args('name', { nullable: true }) name: string,
  ) {
    if (logo) {
      const imagePath = await this.storeImageAndGetUrl(logo);
      return this.workspaceService.updateWorkspace(id, {
        description,
        teamSize,
        inviteLinkActive,
        aiEnabled,
        name,
        logo: imagePath,
      });
    } else
      return this.workspaceService.updateWorkspace(id, {
        description,
        teamSize,
        inviteLinkActive,
        aiEnabled,
        name,
      });
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Workspace)
  async deleteWorkspace(@Args('id') id: string) {
    return this.workspaceService.deleteWorkspace(id);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Workspace)
  async addMembers(@Args('data') data: addMemberDto) {
    return this.workspaceService.addMembers(data);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Workspace)
  async inviteMembers(@Args('data') data: inviteMembersDto) {
    return this.workspaceService.inviteMembers(data);
  }

  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Workspace)
  async removeMembers(@Args('workspaceId') workspaceId: string, @Args('userId') userId: string) {
    return this.workspaceService.removeMembers(workspaceId, userId);
  }
}
