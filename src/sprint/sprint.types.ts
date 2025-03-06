import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Card } from 'src/board/card.types';
import { Project } from 'src/project/project.types';

@ObjectType()
export class Sprint {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  goal?: string;

  @Field()
  createdAt: Date;

  @Field(() => SprintState)
  state: SprintState;

  @Field(() => Project)
  project: Project;

  @Field()
  projectId: string;

  @Field(() => [Card])
  cards: Card[];
}

export enum SprintState {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  COMPLETED = 'Completed',
}

registerEnumType(SprintState, {
  name: 'SprintState',
});
