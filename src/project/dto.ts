import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class createProjectDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field()
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @Field()
  @IsString({ message: 'stream name must be a string' })
  @IsNotEmpty({ message: 'stream name is required' })
  streamName: string;

  @Field()
  @IsString({ message: 'workspace id must be a string' })
  @IsNotEmpty({ message: 'workspace id is required' })
  workspaceId: string;
}
