import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const userId = gqlContext.getContext().req.user.sub;

    // Get required permissions from metadata
    const requiredPermissions = this.reflector.get<
      {
        name: string;
        value: boolean;
        resourceType: string;
      }[]
    >('permissions', context.getHandler());

    if (!requiredPermissions) {
      return true; // No permissions required
    }

    // Extract workspaceId from the request arguments (assuming it's passed as an argument)
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const workspaceId = user.defaultWorkspaceId;

    // Check if user has all required permissions
    const workspaceMember = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        status: "ACTIVE"
      },
      include: {
        role: {
          select: {
            Permissions: true,
          },
        },
      },
    });

    if (!workspaceMember) {
      throw new ForbiddenException('User is not a member of this workspace.');
    }

    const userPermissions = workspaceMember.role.Permissions;

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.some(
        (p) =>
          p.name === perm.name &&
          p.value === true &&
          p.resourceType === perm.resourceType,
      ),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    return true;
  }
}
