import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/project/project.types';
import { User } from 'src/user/user.type';

@ObjectType()
export class Task {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  projectId: string;

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
  @Field(() => Project)
  project: Project;

  @Field(() => [TaskAssignment])
  assignedUsers: TaskAssignment[];

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
