import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Message } from './message.types';
import { MessageService } from './message.service';
import { sendMessageDto } from './dto';
import { Request } from 'express';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const imagePath = join(process.cwd(), 'public', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('data') data: sendMessageDto,
    @Context() context: { req: Request },
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload.FileUpload,
    @Args('voiceMessage', { type: () => GraphQLUpload, nullable: true })
    voiceMessage: GraphQLUpload.FileUpload,
  ) {
    if (file) {
      const imageUrl = await this.storeImageAndGetUrl(file);
      return this.messageService.sendMessage(
        data,
        context.req.user.sub,
        imageUrl,
      );
    } else if (voiceMessage) {
      const voiceMessageUrl = await this.storeImageAndGetUrl(voiceMessage);
      return this.messageService.sendMessage(
        data,
        context.req.user.sub,
        null,
        voiceMessageUrl,
      );
    } else {
      return this.messageService.sendMessage(data, context.req.user.sub);
    }
  }

  @Mutation(() => Message)
  async updateMessage(
    @Args('messageId') messageId: string,
    @Args('text') text: string,
  ) {
    return this.messageService.updateMessage(messageId, text);
  }

  @Mutation(() => Message)
  async deleteMessage(@Args('messageId') messageId: string) {
    return this.messageService.deleteMessage(messageId);
  }

  @Mutation(() => Message)
  async pinMessage(@Args('messageId') messageId: string) {
    return this.messageService.pinMessage(messageId);
  }

  @Query(() => [Message])
  async getMessages(
    @Args('channelId') channelId: string,
    @Context() context: { req: Request },
  ) {
    return this.messageService.getMessages(channelId, context.req.user.sub);
  }
}
