import { Module } from '@nestjs/common';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/prisma.services';
import { PermissionService } from 'src/permission/permission.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RolesResolver, RolesService, PrismaService, PermissionService, JwtService],
})
export class RolesModule {}
