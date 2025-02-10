import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createPermissionDto, ResourceType } from './dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async createPermission(data: createPermissionDto, roleId: string) {
    return this.prisma.permission.create({
      data: {
        ...data,
        Role: {
          connect: { id: roleId },
        },
      },
    });
  }

  async createDefaultPermissions(roleId: string) {
    const defaultPermissions: createPermissionDto[] = [
      {
        name: 'update',
        value: true,
        resourceType: ResourceType.WORKSPACE,
      },
      {
        name: 'delete',
        value: true,
        resourceType: ResourceType.WORKSPACE,
      },
      {
        name: 'add-members',
        value: true,
        resourceType: ResourceType.WORKSPACE,
      },
      {
        name: 'remove-member',
        value: true,
        resourceType: ResourceType.WORKSPACE,
      },
      {
        name: 'create',
        value: true,
        resourceType: ResourceType.CHANNEL,
      },
      {
        name: 'read',
        value: true,
        resourceType: ResourceType.CHANNEL,
      },
      {
        name: 'update',
        value: true,
        resourceType: ResourceType.CHANNEL,
      },
      {
        name: 'delete',
        value: true,
        resourceType: ResourceType.CHANNEL,
      },
      {
        name: "add-members",
        value: true,
        resourceType: ResourceType.CHANNEL,
      },
      {
        name: "remove-member",
        value: true,
        resourceType: ResourceType.CHANNEL,
      },
      {
        name: 'create',
        value: true,
        resourceType: ResourceType.STREAM,
      },
      {
        name: 'read',
        value: true,
        resourceType: ResourceType.STREAM,
      },
      {
        name: 'update',
        value: true,
        resourceType: ResourceType.STREAM,
      },
      {
        name: 'delete',
        value: true,
        resourceType: ResourceType.STREAM,
      },
      {
        name: "add-members",
        value: true,
        resourceType: ResourceType.STREAM
      },
      {
        name: "remove-member",
        value: true,
        resourceType: ResourceType.STREAM
      },
      {
        name: 'create',
        value: true,
        resourceType: ResourceType.PROJECT,
      },
      {
        name: 'read',
        value: true,
        resourceType: ResourceType.PROJECT,
      },
      {
        name: 'update',
        value: true,
        resourceType: ResourceType.PROJECT,
      },
      {
        name: 'delete',
        value: true,
        resourceType: ResourceType.PROJECT,
      },
      {
        name: 'create',
        value: true,
        resourceType: ResourceType.TASK,
      },
      {
        name: 'read',
        value: true,
        resourceType: ResourceType.TASK,
      },
      {
        name: 'update',
        value: true,
        resourceType: ResourceType.TASK,
      },
      {
        name: 'delete',
        value: true,
        resourceType: ResourceType.TASK,
      },
      {
        name: 'create',
        value: true,
        resourceType: ResourceType.TEAM
      },
      {
        name: 'read',
        value: true,
        resourceType: ResourceType.TEAM,
      },
      {
        name: 'update',
        value: true,
        resourceType: ResourceType.TEAM,
      },
      {
        name: 'delete',
        value: true,
        resourceType: ResourceType.TEAM,
      },
      {
        name: "add-members",
        value: true,
        resourceType: ResourceType.TEAM,
      },
      {
        name: "remove-member",
        value: true,
        resourceType: ResourceType.TEAM,
      },
    ];

    for (const permission of defaultPermissions) {
      await this.createPermission(permission, roleId);
    }

    return;
  }

  async getPermissions(roleId: string) {
    return this.prisma.permission.findMany({
      where: { roleId },
    });
  }

  async updatePermission(id: string, value: boolean) {
    return this.prisma.permission.update({
      where: { id },
      data: { value },
    });
  }
}
