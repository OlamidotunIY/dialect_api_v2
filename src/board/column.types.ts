import { Field, ObjectType } from "@nestjs/graphql";
import { Status } from "src/task/task.types";
import { Card } from "./card.types";
import { Board } from "./board.types";


@ObjectType()
export class Column {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Status, { nullable: true })
  status?: Status;

  @Field({ nullable: true })
  statusId?: string;

  @Field()
  isInitial: boolean;

  @Field(() => [Card])
  cards: Card[];

  @Field(() => Board)
  board: Board;

  @Field()
  boardId: string;
}