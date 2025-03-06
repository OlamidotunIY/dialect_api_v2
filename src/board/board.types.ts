import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/project.types';
import { IssueType, Status } from 'src/task/task.types';
import { Card } from './card.types';
import { Column } from './column.types';





@ObjectType()
export class Board {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Project)
  project: Project;

  @Field()
  projectId: string;

  @Field(() => [Column])
  columns: Column[];

  @Field(() => [IssueType])
  issueTypes: IssueType[];
}
