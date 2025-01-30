import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserData(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        workspaces: {
          include: {
            workspace: true,
            role: true,
          },
        },
        assignedTasks: true,
        streams: true,
      },
    });
  }

  async updateProfile(userId: string, fullname: string, picture: string) {
    if (picture) {
      return this.prisma.user.update({
        where: { id: userId },
        data: { fullname, picture },
      });
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { fullname },
    });
  }
}
