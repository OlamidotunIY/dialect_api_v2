import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/project.types';
import { User } from 'src/user/user.type';
import { Workspace } from 'src/workspace/workspace.type';

@ObjectType()
export class Stream {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  workspaceId: string;

  // Relations
  @Field(() => Workspace)
  workspace: Workspace;

  @Field(() => [StreamMembers])
  streamMembers: StreamMembers[];

  @Field(() => [Project])
  projects: Project[];
}

@ObjectType()
export class StreamMembers {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  streamId: string;

  @Field()
  role: string;

  // Relations
  @Field(() => User)
  user: User;

  @Field(() => Stream)
  stream: Stream;
}
