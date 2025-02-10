import { Field, ObjectType } from '@nestjs/graphql';
import { Stream, StreamMembers } from 'src/stream/stream.types';

@ObjectType()
export class Team {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  streamId: string;

  @Field(() => Stream)
  stream: Stream;

  @Field(() => [StreamMembers])
  streamMembers: StreamMembers[];
}
