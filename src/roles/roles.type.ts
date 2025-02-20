import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Workspace, WorkspaceMember } from 'src/workspace/workspace.type';

@ObjectType()
export class Role {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo: string;

  @Field()
  workspaceId: string;

  // Relations
  @Field(() => [WorkspaceMember])
  workspaceMembers: WorkspaceMember[];

  @Field(() => Workspace)
  workspace: Workspace;

  @Field(() => [Permission])
  Permissions: Permission[];
}

@ObjectType()
export class Permission {
  @Field()
  id: string;

  @Field()
  name: string; // Permission name (e.g., "edit", "manageRoles", etc.)

  @Field()
  value: boolean; // Default value for the permission (false or true)

  @Field(() => ResourceType)
  resourceType: ResourceType; // Type of resource the permission belongs to (workspace, channel, etc.)

  @Field({ nullable: true })
  roleId?: string; // Nullable since permissions might not always be tied to a role

  // Relations
  @Field(() => Role, { nullable: true })
  Role?: Role; // Optional relation to a Role
}

enum ResourceType {
  WORKSPACE = 'WORKSPACE',
  CHANNEL = 'CHANNEL',
  STREAM = 'STREAM',
  PROJECT = 'PROJECT',
  TASK = 'TASK',
  TEAM = 'TEAM',
}

registerEnumType(ResourceType, {
  name: 'ResourceType',
});
