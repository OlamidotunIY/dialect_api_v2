import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/board/board.types';
import { Sprint } from 'src/sprint/sprint.types';
import { Stream } from 'src/stream/stream.types';
import { Task } from 'src/task/task.types';
import { Team } from 'src/team/team.types';

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  logo: string;

  @Field()
  streamId: string;

  @Field()
  status: string; // Default value: "Not Started"

  @Field({ nullable: true })
  startDate: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  priority: string; // Default value: "Low"

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  progress: number; // Default value: 0

  // Relations
  @Field(() => Stream)
  stream: Stream;

  @Field(() => [Task])
  tasks: Task[];

  @Field(() => Team, { nullable: true })
  team: Team;

  @Field(() => Board, { nullable: true })
  Board: Board;

  @Field(() => [Sprint], { nullable: true })
  Sprints: Sprint[];
}
