import { Field, ObjectType } from "@nestjs/graphql";
import { Stream } from "src/stream/stream.types";
import { Task } from "src/task/task.types";

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  streamId: string;

  @Field()
  title: string;

  @Field()
  status: string; // Default value: "Not Started"

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  priority: string; // Default value: "Low"

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => Stream)
  stream: Stream;

  @Field(() => [Task])
  tasks: Task[];
}