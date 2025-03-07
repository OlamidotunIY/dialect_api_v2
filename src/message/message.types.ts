import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Message {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  isPinned: boolean;

  @Field()
  imageUrl: string;

  @Field()
  voiceMessageUrl: string;

  @Field()
  isEdited: boolean;

  @Field()
  userId: string;

  @Field()
  channelId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
