import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class createRolesDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;
}
