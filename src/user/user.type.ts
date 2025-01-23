import { Field, ObjectType } from '@nestjs/graphql';

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
}
