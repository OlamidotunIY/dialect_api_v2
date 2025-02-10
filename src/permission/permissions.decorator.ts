import { SetMetadata } from '@nestjs/common';
import { ResourceType } from '@prisma/client';

export const Permissions = (
  permissions: { name: string; value: boolean; resourceType: ResourceType }[],
) => SetMetadata('permissions', permissions);
