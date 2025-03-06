import { Field, ObjectType } from "@nestjs/graphql";
import { Sprint } from "src/sprint/sprint.types";
import { Task } from "src/task/task.types";
import { Column } from "./column.types";


@ObjectType()
export class Card {
  @Field()
  id: string;

  @Field()
  issueId: string;

  @Field()
  done: boolean;

  @Field(() => Sprint, { nullable: true })
  sprint?: Sprint;

  @Field({ nullable: true })
  sprintId?: string;

  @Field()
  priority: number;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  createdAt: Date;

  @Field(() => Task)
  issue: Task;

  @Field(() => Column, { nullable: true })
  Column?: Column;

  @Field({ nullable: true })
  columnId?: string;
}