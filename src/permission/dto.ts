import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export enum ResourceType {
  WORKSPACE = 'WORKSPACE',
  CHANNEL = 'CHANNEL',
  STREAM = 'STREAM',
  PROJECT = 'PROJECT',
  TASK = 'TASK',
}

// Register the enum with GraphQL
registerEnumType(ResourceType, {
  name: 'ResourceType',
  description: 'Available resource types',
});

@InputType()
export class createPermissionDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @Field()
  @IsBoolean({ message: 'Value must be a boolean' })
  value: boolean;

  @Field()
  @IsNotEmpty({ message: 'resourceType is required' })
  @IsEnum(ResourceType, { message: 'Invalid resource type' })
  resourceType: ResourceType;
}
