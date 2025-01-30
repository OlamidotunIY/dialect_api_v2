import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateWorkspaceDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name?: string;

  @Field({ nullable: true })
  @IsString({ message: 'Logo must be a string' })
  logo?: string;
}
@InputType()
export class UpdateWorkspaceDto extends CreateWorkspaceDto {
  @Field({ nullable: true })
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Field({ nullable: true })
  @IsString({ message: 'Team size must be a string' })
  teamSize?: number;

  @Field({ nullable: true })
  @IsBoolean({ message: 'Invite link active must be a boolean' })
  inviteLinkActive?: boolean;

  @Field({ nullable: true })
  @IsBoolean({ message: 'AI enabled must be a boolean' })
  aiEnabled?: boolean;
}
@InputType()
export class addMemberDto {
  @Field()
  @IsNotEmpty({ message: 'Workspace ID is required' })
  @IsString({ message: 'Workspace ID must be a string' })
  workspaceId: string;

  @Field()
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  WorkspaceMemberId: string;
}
@InputType()
export class inviteMembersDto {
  @Field()
  @IsNotEmpty({ message: 'Workspace ID is required' })
  @IsString({ message: 'Workspace ID must be a string' })
  workspaceId: string;

  @Field(() => [String])
  @IsArray({ message: 'User Emails must be an array' })
  @IsNotEmpty({ message: 'User Emails cannot be empty' })
  userEmails: string[];
}
