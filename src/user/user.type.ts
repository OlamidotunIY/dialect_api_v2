import { Field, ObjectType } from '@nestjs/graphql';
import { Workspace, WorkspaceMember } from 'src/workspace/workspace.type';

@ObjectType()
export class User {
  @Field()
  id?: string;

  @Field()
  email?: string;

  @Field()
  fullname?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  picture?: string;

  @Field({ nullable: true })
  voice_id?: string;

  @Field()
  enabledAI?: boolean;

  @Field()
  preferredLanguage?: string;

  @Field()
  twoFactorEnabled?: boolean;

  @Field({ nullable: true })
  twoFactorSecret?: string;

  @Field({ nullable: true })
  twoFactorSecretAnswer?: string;

  @Field({ nullable: true })
  defaultWorkspaceId?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => [Workspace], { nullable: true })
  ownedWorkspaces?: Workspace[];

  @Field(() => [WorkspaceMember], { nullable: true })
  workspaces?: WorkspaceMember[];
}
