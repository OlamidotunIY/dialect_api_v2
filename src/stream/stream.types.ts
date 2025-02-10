import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/project.types';
import { Team } from 'src/team/team.types';
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

  @Field()
  teamId: string;

  // Relations
  @Field(() => Workspace)
  workspace: Workspace;

  @Field(() => [StreamMembers])
  streamMembers: StreamMembers[];

  @Field(() => [Project])
  projects: Project[];

  @Field(() => Team)
  Team: Team;
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
