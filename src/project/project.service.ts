import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { createProjectDto } from './dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: createProjectDto) {
    const stream = await this.prisma.stream.findUnique({
      where: { id: data.streamId },
    });

    if (!stream) {
      throw new BadRequestException('Stream not found');
    }

    return this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        stream: { connect: { id: data.streamId } },
      },
    });
  }

  async getProjects(streamId: string) {
    return this.prisma.project.findMany({ where: { streamId } });
  }

  async getProjectById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          include: {
            assignedUsers: true,
          },
        },
      },
    });
  }

  async updateProject(id: string, data: createProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async deleteProject(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async assignProjectToTeam(projectId: string, teamId: string) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: { team: { connect: { id: teamId } } },
    });
  }

  async removeProjectFromTeam(projectId: string) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: { team: { disconnect: true } },
    });
  }
}
