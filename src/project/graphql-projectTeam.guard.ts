import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class ProjectTeamGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { projectId } = gqlContext.getArgs(); // Assumes `projectId` is passed as an argument
    const userId = gqlContext.getContext().req.user.sub; // Assumes the user ID is in the context

    // Fetch project with team and members
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } },
    });

    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    // Check team association
    if (project.teamId) {
      const isMember = project.team.members.some(member => member.userId === userId);
      if (!isMember) {
        throw new ForbiddenException('User is not part of the assigned team');
      }
    }

    return true;
  }
}
