import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createRolesDto } from './dto';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionService: PermissionService,
  ) {}

  async getRoles(workspaceId: string) {
    return this.prisma.role.findMany({
      where: {
        workspaceId,
      },
      include: {
        workspaceMembers: true,
        Permissions: true,
      },
    });
  }

  async getRole(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        workspaceMembers: true,
        Permissions: true,
      },
    });
  }

  async createRoles(workspaceId: string, data: createRolesDto) {
    const role = await this.prisma.role.create({
      data: {
        ...data,
        workspace: {
          connect: { id: workspaceId },
        },
      },
    });

    // create default permissions
    await this.permissionService.createDefaultPermissions(role.id);

    return role;
  }

  async updateRole(id: string, data: createRolesDto) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }
}
