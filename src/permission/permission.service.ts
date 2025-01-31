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
        name: 'create',
        value: true,
        resourceType: ResourceType.WORKSPACE,
      },
      {
        name: 'read',
        value: true,
        resourceType: ResourceType.WORKSPACE,
      },
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
    ];

    for (const permission of defaultPermissions) {
      await this.createPermission(permission, roleId);
    }

    return;
  }
}
