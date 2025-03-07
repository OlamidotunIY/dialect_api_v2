import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.services';
import { sendMessageDto } from './dto';
import { TranslationService } from 'src/translation/translation.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly translation: TranslationService,
  ) {}

  async sendMessage(
    data: sendMessageDto,
    userId: string,
    imageUrl?: string,
    voiceMessageUrl?: string,
  ) {
    const channelMember = this.prisma.channelMember.findFirst({
      where: {
        channelId: data.channelId,
        userId,
      },
    });

    const message = await this.prisma.message.create({
      data: {
        text: data.text,
        imageUrl: imageUrl,
        voiceMessageUrl: voiceMessageUrl,
        channel: {
          connect: {
            id: data.channelId,
          },
        },
        sender: {
          connect: {
            id: (await channelMember).id,
          },
        },
      },
    });

    await this.translation.translateContent(data.text, message.id);

    return message;
  }

  async updateMessage(id: string, text: string) {
    return this.prisma.message.update({
      where: {
        id,
      },
      data: {
        text,
        isEdited: true,
      },
    });
  }

  async deleteMessage(id: string) {
    return this.prisma.message.delete({
      where: {
        id,
      },
    });
  }

  async pinMessage(id: string) {
    return this.prisma.message.update({
      where: {
        id,
      },
      data: {
        isPinned: true,
      },
    });
  }

  async unpinMessage(id: string) {
    return this.prisma.message.update({
      where: {
        id,
      },
      data: {
        isPinned: false,
      },
    });
  }

  async getMessages(channelId: string, userId: string) {
    const channelSettings = await this.prisma.channelSetting.findFirst({
      where: {
        channelId,
        userId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return this.prisma.message.findMany({
      where: {
        channelId,
      },
      include: {
        textTranslations: channelSettings?.enabledAITextTranslation
          ? {
              where: {
                language: user.preferredLanguage,
              },
            }
          : false,
        sender: true,
        voiceMessageTranslations: channelSettings?.enabledAIVoiceTranslation
          ? {
              where: {
                language: user.preferredLanguage,
              },
            }
          : false,
      },
    });
  }
}
