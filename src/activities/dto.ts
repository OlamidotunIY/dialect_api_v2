import { Field, InputType } from '@nestjs/graphql';
import { ActivityType } from '@prisma/client';

InputType();
export class createActivityDto {
  @Field()
  userId: string;

  @Field()
  description: string;

  @Field(() => ActivityType)
  type: ActivityType;

  @Field({ nullable: true })
  streamId?: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field({ nullable: true })
  workspaceId?: string;

  @Field({ nullable: true })
  taskId?: string;

  @Field({ nullable: true })
  channelId?: string;
}
