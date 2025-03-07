import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Stream } from 'src/stream/stream.types';
import { Workspace } from 'src/workspace/workspace.type';
import { ChannelMember } from './channelMembers.types';
import { Activity } from 'src/activities/activities.types';
import { Message } from 'src/message/message.types';

export enum ChannelType {
  GROUP = 'Group',
  DIRECT = 'Direct',
}

registerEnumType(ChannelType, {
  name: 'ChannelType',
});

@ObjectType()
export class Channel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isDirect: boolean;

  @Field()
  type: ChannelType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  workspaceId: string;

  @Field({ nullable: true })
  streamId: string;

  @Field(() => Workspace, { nullable: true })
  workspace: Workspace;

  @Field(() => Stream, { nullable: true })
  Stream: Stream[];

  @Field(() => [ChannelMember], { nullable: true })
  members: ChannelMember[];

  @Field(() => [Activity], { nullable: true })
  Activities: Activity[];

  @Field(() => [Message], { nullable: true })
  Messages: Message[];
}
