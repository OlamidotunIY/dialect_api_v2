import { Module } from '@nestjs/common';
import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceService } from './workspace.service';
import { RolesService } from 'src/roles/roles.service';
import { PermissionService } from 'src/permission/permission.service';
import { PrismaService } from 'src/prisma.services';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [WorkspaceResolver, WorkspaceService, RolesService, PermissionService, PrismaService, EmailService, JwtService],
})
export class WorkspaceModule {}
