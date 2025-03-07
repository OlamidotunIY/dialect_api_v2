import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class createStreamDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @Field({ nullable: true })
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Field()
  @IsString({ message: 'Workspace Id must be a string' })
  @IsNotEmpty({ message: 'Workspace Id is required' })
  workspaceId: string;

  @Field()
  workspaceMemberId: string;

  @Field()
  userId: string;
}
