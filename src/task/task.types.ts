import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Activity } from 'src/activities/activities.types';
import { Board } from 'src/board/board.types';
import { Column } from 'src/board/column.types';
import { Project } from 'src/project/project.types';
import { User } from 'src/user/user.type';

@ObjectType()
export class Status {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [Column])
  Column: Column[];

  @Field(() => [Task])
  Task: Task[];
}

@ObjectType()
export class Task {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  key: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  projectId: string;

  @Field(() => Status, { nullable: true })
  status: Status; // Default value: "Not Started"

  @Field({ nullable: true })
  dueDate?: Date;

  @Field()
  priority: string; // Default value: "Low"

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Relations
  @Field(() => Project, { nullable: true })
  project: Project;

  @Field(() => User, { nullable: true })
  assignee?: User;

  @Field(() => User, { nullable: true })
  reporter?: User;

  @Field(() => [Dependency])
  dependencies: Dependency[];

  @Field(() => [Dependency])
  dependents: Dependency[];

  @Field(() => [ChecklistItem])
  checklistItems: ChecklistItem[];

  @Field(() => [Task])
  subtasks: Task[];

  @Field(() => Task, { nullable: true })
  parent?: Task;
}

@ObjectType()
export class Dependency {
  @Field()
  id: string;

  @Field()
  taskId: string;

  @Field()
  dependsOn: string;

  // Relations
  @Field(() => Task)
  task: Task;

  @Field(() => Task)
  dependsOnTask: Task;
}

@ObjectType()
export class TaskAssignment {
  @Field()
  id: string;

  @Field()
  taskId: string;

  @Field()
  userId: string;

  // Relations
  @Field(() => Task)
  task: Task;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class ChecklistItem {
  @Field()
  id: string;

  @Field()
  taskId: string;

  @Field()
  content: string;

  @Field()
  isDone: boolean;

  // Relations
  @Field(() => Task)
  task: Task;
}

@ObjectType()
export class IssueType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  iconUrl: string;

  @Field(() => Board, { nullable: true })
  Board?: Board;

  @Field({ nullable: true })
  boardId?: string;
}

@ObjectType()
export class taskCountSummary {
  @Field()
  completedTasksCount: number;

  @Field()
  dueTasksCount: number;

  @Field()
  overdueTasksCount: number;

  @Field()
  newTasksCount: number;

  @Field()
  updatedTasksCount: number;
}

@ObjectType()
export class statusOverview {
  @Field()
  statusName: string;

  @Field()
  taskCount: number;
}
@ObjectType()
export class Summary {
  @Field(() => taskCountSummary)
  taskCountSummary: taskCountSummary;

  @Field(() => [statusOverview])
  statusOverview: statusOverview[];

  @Field(() => [Activity])
  activities: Activity[];
}
