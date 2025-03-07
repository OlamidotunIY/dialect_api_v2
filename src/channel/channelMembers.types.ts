import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/user/user.type';
import { Channel } from './channel.types';

@ObjectType()
export class ChannelMember {
  @Field()
  id: string;

  @Field()
  channelId: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => Channel)
  channel: Channel;
}
