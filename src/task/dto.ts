import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTaskDto {
  @Field()
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @Field()
  @IsString({ message: 'projectId must be a string' })
  @IsNotEmpty({ message: 'projectId is required' })
  projectId: string;

  @Field(() => ID, { nullable: true })
  sprintId?: string;
}
