import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.services';
import { addMemberDto, inviteMembersDto, UpdateWorkspaceDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { RolesService } from 'src/roles/roles.service';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly rolesService: RolesService,
  ) {}

  private async generateInviteToken() {
    const randomString = randomBytes(30).toString('hex');
    return randomString;
  }

  private async generateInviteLink(): Promise<string> {
    let inviteLink: string;
    let isUnique = false;

    while (!isUnique) {
      // Generate a random invite link using UUID
      inviteLink = uuidv4();
      // Check if the invite link is already in use
      const existingWorkspace = await this.prisma.workspace.findUnique({
        where: { inviteLink },
      });

      isUnique = !existingWorkspace;
    }

    return inviteLink;
  }

  async getWorkspace(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id },
      include: {
        roles: true,
        members: {
          include: {
            user: true,
          },
        },
        owner: true,
        streams: true,
      },
    });
  }

  async createWorkspace(name: string, sub: string, imagePath?: string) {
    const inviteLink = await this.generateInviteLink();

    let workspace = await this.prisma.workspace.create({
      data: {
        name,
        logo: imagePath,
        inviteLink,
        owner: {
          connect: { id: sub },
        },
      },
    });

    await this.prisma.user.update({
      where: { id: sub },
      data: {
        defaultWorkspaceId: workspace.id,
      },
    });

    // create default roles

    const role = await this.rolesService.createRoles(workspace.id, {
      name: 'Admin',
    });

    workspace = await this.prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        defaultRoleId: role.id,
      },
    });

    await this.prisma.workspaceMember.create({
      data: {
        workspace: {
          connect: { id: workspace.id },
        },
        user: {
          connect: { id: sub },
        },
        role: {
          connect: {
            id: workspace.defaultRoleId,
          },
        },
        status: 'ACTIVE',
      },
    });

    return workspace;
  }

  async updateWorkspace(id: string, data: UpdateWorkspaceDto) {
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async deleteWorkspace(id: string) {
    return this.prisma.workspace.delete({
      where: { id },
    });
  }

  async addMembers(data: addMemberDto) {
    const { workspaceId, WorkspaceMemberId } = data;
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        members: {
          update: {
            where: {
              id: WorkspaceMemberId,
            },
            data: {
              status: 'ACTIVE',
            },
          },
        },
      },
    });
  }

  async inviteMembers(data: inviteMembersDto) {
    const { workspaceId, userEmails } = data;
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        roles: true,
      },
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const token = await this.generateInviteToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    for (const email of userEmails) {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        const existingWorkspaceMember =
          await this.prisma.workspaceMember.findFirst({
            where: {
              workspaceId,
              userId: user.id,
              status: 'ACTIVE',
            },
          });

        if (existingWorkspaceMember) {
          throw new BadRequestException(
            `${email} is already a member of this workspace`,
          );
        } else {
          await this.prisma.workspaceMember.create({
            data: {
              workspace: {
                connect: { id: workspaceId },
              },
              user: {
                connect: { id: user.id },
              },
              role: {
                connect: {
                  id: workspace.defaultRoleId,
                },
              },
            },
          });

          // Send email to user
          const subject = `You have been invited to join ${workspace.name} workspace`;
          const link = `${this.configService.get('FRONTEND_URL')}/invite?workspaceId=${workspaceId}&workspaceMemberId=${user.id}`;
          const html = `
  <p>Hi <strong>${user.fullname}</strong>,</p>
  <p><br>You&apos;ve been invited to join the workspace <strong>${workspace.name}</strong>. Click the link below to accept the invite and start collaborating:</p>
  <p><br><a href="${link}" target="_blank" rel="noopener noreferrer">Accept Invite Link</a></p>
  <p>Looking forward to having you on board!</p>`;

          await this.emailService.sendMail(email, subject, html);
        }
      } else {
        await this.prisma.workspaceInvite.create({
          data: {
            workspace: {
              connect: { id: workspaceId },
            },
            email,
            token,
            expiresAt,
            status: 'PENDING',
          },
        });

        const link = `${this.configService.get('FRONTEND_URL')}/register?inviteToken=${token}`;
        const subject = `You have been invited to join ${workspace.name} workspace`;
        const html = `
  <p>Hi,</p>
  <p><br>You&apos;ve been invited to join the workspace <strong>${workspace.name}</strong>. To accept the invite and get started, please sign up using the link below:</p>
  <p><br><a href="${link}" target="_blank" rel="noopener noreferrer">Sign Up & Accept Invite Link</a></p>
  <p>We’re excited to welcome you!</p>`;

        await this.emailService.sendMail(email, subject, html);
      }
    }

    return workspace;
  }
}
