import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from 'src/roles/roles.type';
import { Stream } from 'src/stream/stream.types';
import { User } from 'src/user/user.type';

@ObjectType()
export class Workspace {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  teamSize?: number;

  @Field()
  ownerId: string;

  @Field({ nullable: true })
  defaultStreamId?: number;

  @Field({ nullable: true })
  inviteLink?: string;

  @Field()
  inviteLinkActive: boolean;

  @Field({ nullable: true })
  logo?: string;

  @Field()
  subscriptionPlan: string; // Enum or scalar

  @Field({ nullable: true })
  subscriptionExpiryDate?: Date;

  @Field()
  aiEnabled: boolean;

  @Field({ nullable: true })
  stripeCustomerId?: string;

  @Field({ nullable: true })
  stripeSubscriptionId?: string;

  @Field({ nullable: true })
  subscriptiontrialEnd?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => User)
  owner: User;

  @Field(() => [WorkspaceMember])
  members: WorkspaceMember[];

  @Field(() => [Stream])
  streams: Stream[];

  @Field(() => [Role])
  roles: Role[];
}

@ObjectType()
export class WorkspaceMember {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  workspaceId: string;

  @Field()
  roleId: string;

  @Field(() => WorkspaceMemberStatus)
  status: WorkspaceMemberStatus; // Default: "pending"

  // Relations
  @Field(() => User)
  user: User;

  @Field(() => Workspace)
  workspace: Workspace;

  @Field(() => Role)
  role: Role;
}

export enum WorkspaceMemberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

registerEnumType(WorkspaceMemberStatus, {
  name: 'WorkspaceMemberStatus',
});
