import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.type';

@ObjectType()
export class Auth {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}