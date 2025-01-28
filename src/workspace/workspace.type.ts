import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.type';

@ObjectType()
export class Workspace {
  @Field()
  id?: string;

  @Field()
  name?: string;

  @Field()
  description?: string;

  @Field()
  teamSize?: number;

  @Field()
  ownerId: string;

  @Field()
  defaultStreamId: string;

  @Field()
  inviteLink: string;

  @Field()
  inviteLinkActive: boolean;

  @Field()
  logo?: string;
}

@ObjectType()
export class WorkspaceMember {
  @Field()
  id?: string;

  @Field()
  userId?: string;

  @Field()
  workspaceId?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => Workspace, { nullable: true })
  workspace?: Workspace; // Relation to Workspace
}
