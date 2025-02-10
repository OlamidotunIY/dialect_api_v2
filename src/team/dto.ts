import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class createTeamDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  streamId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  memberIds?: string[];
}
