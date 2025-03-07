import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class sendMessageDto {
  @Field({ nullable: true })
  @IsString({ message: 'channelId must be a string' })
  channelId: string;

  @Field()
  @IsNotEmpty({ message: 'Text is required' })
  @IsString({ message: 'Text must be a string' })
  text: string;

  @Field()
  @IsBoolean({ message: 'isPinned must be a boolean' })
  isPinned: boolean;

  @Field()
  @IsBoolean({ message: 'isEdited must be a boolean' })
  isEdited: boolean;
}
