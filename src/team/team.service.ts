import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createTeamDto } from './dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeam(data: createTeamDto) {
    if (data.memberIds.length === 0) {
      return this.prisma.team.create({
        data: {
          name: data.name,
          stream: {
            connect: { id: data.streamId },
          },
        },
        include: {
          members: true,
          stream: true,
        },
      });
    }
  }

  async getTeams(streamId: string) {
    return this.prisma.team.findMany({
      where: { streamId },
      include: {
        members: true,
        stream: true,
      },
    });
  }

  async getTeam(teamId: string) {
    return this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
        stream: true,
      },
    });
  }

  async addMemberToTeam(teamId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    const streamMember = await this.prisma.streamMembers.findFirst({
      where: {
        userId,
        streamId: team.streamId,
      },
    });

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          connect: { id: streamMember.id },
        },
      },
    });
  }

  async removeMemberFromTeam(teamId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    const streamMember = await this.prisma.streamMembers.findFirst({
      where: {
        userId,
        streamId: team.streamId,
      },
    });

    return this.prisma.team.update({
      where: { id: teamId },
      data: {
        members: {
          disconnect: { id: streamMember.id },
        },
      },
    });
  }

  async deleteTeam(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });

    if (!team) {
      throw new BadRequestException('Team not found');
    }

    return this.prisma.team.delete({
      where: { id: teamId },
    });
  }
}
