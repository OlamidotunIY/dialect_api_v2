import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Test@1234', 10);

  // Create Users
  console.log('👤 Creating users...');
  const mainUser = await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      fullname: 'Alex Johnson',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=1',
      preferredLanguage: 'en',
      twoFactorEnabled: false,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sarah.wilson@gmail.com',
      fullname: 'Sarah Wilson',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=5',
      preferredLanguage: 'en',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'michael.chen@gmail.com',
      fullname: 'Michael Chen',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=12',
      preferredLanguage: 'zh',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'emily.davis@gmail.com',
      fullname: 'Emily Davis',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=9',
      preferredLanguage: 'en',
    },
  });

  const user5 = await prisma.user.create({
    data: {
      email: 'carlos.rodriguez@gmail.com',
      fullname: 'Carlos Rodriguez',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=15',
      preferredLanguage: 'es',
    },
  });

  const user6 = await prisma.user.create({
    data: {
      email: 'priya.patel@gmail.com',
      fullname: 'Priya Patel',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=20',
      preferredLanguage: 'en',
    },
  });

  const user7 = await prisma.user.create({
    data: {
      email: 'james.brown@gmail.com',
      fullname: 'James Brown',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=33',
      preferredLanguage: 'en',
    },
  });

  const user8 = await prisma.user.create({
    data: {
      email: 'lisa.anderson@gmail.com',
      fullname: 'Lisa Anderson',
      password: hashedPassword,
      picture: 'https://i.pravatar.cc/150?img=47',
      preferredLanguage: 'en',
    },
  });

  console.log('✅ Created 8 users');

  // Create Workspace
  console.log('🏢 Creating workspace...');
  const workspace = await prisma.workspace.create({
    data: {
      name: 'TechVentures Inc',
      description: 'A collaborative workspace for innovative software development projects',
      ownerId: mainUser.id,
      teamSize: 8,
      logo: 'https://ui-avatars.com/api/?name=TechVentures+Inc&background=6366f1&color=fff&size=200',
      subscriptionPlan: 'PRO',
      aiEnabled: true,
      inviteLinkActive: true,
    },
  });

  console.log('✅ Created workspace');

  // Create Roles
  console.log('👔 Creating roles...');
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Full access to all workspace features',
      workspaceId: workspace.id,
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: 'Project Manager',
      description: 'Can manage projects and teams',
      workspaceId: workspace.id,
    },
  });

  const developerRole = await prisma.role.create({
    data: {
      name: 'Developer',
      description: 'Can work on tasks and contribute to projects',
      workspaceId: workspace.id,
    },
  });

  const designerRole = await prisma.role.create({
    data: {
      name: 'Designer',
      description: 'Responsible for UI/UX design',
      workspaceId: workspace.id,
    },
  });

  const qaRole = await prisma.role.create({
    data: {
      name: 'QA Engineer',
      description: 'Quality assurance and testing',
      workspaceId: workspace.id,
    },
  });

  console.log('✅ Created 5 roles');

  // Create Permissions
  console.log('🔐 Creating permissions...');
  const permissions: Array<{
    name: string;
    value: boolean;
    resourceType: 'WORKSPACE' | 'CHANNEL' | 'STREAM' | 'PROJECT' | 'TASK' | 'TEAM';
    roleId: string;
  }> = [
    // Workspace permissions
    { name: 'manage_workspace', value: true, resourceType: 'WORKSPACE', roleId: adminRole.id },
    { name: 'view_workspace', value: true, resourceType: 'WORKSPACE', roleId: adminRole.id },
    { name: 'invite_members', value: true, resourceType: 'WORKSPACE', roleId: adminRole.id },
    { name: 'manage_roles', value: true, resourceType: 'WORKSPACE', roleId: adminRole.id },

    { name: 'view_workspace', value: true, resourceType: 'WORKSPACE', roleId: managerRole.id },
    { name: 'invite_members', value: true, resourceType: 'WORKSPACE', roleId: managerRole.id },

    { name: 'view_workspace', value: true, resourceType: 'WORKSPACE', roleId: developerRole.id },
    { name: 'view_workspace', value: true, resourceType: 'WORKSPACE', roleId: designerRole.id },
    { name: 'view_workspace', value: true, resourceType: 'WORKSPACE', roleId: qaRole.id },

    // Project permissions
    { name: 'create_project', value: true, resourceType: 'PROJECT', roleId: adminRole.id },
    { name: 'edit_project', value: true, resourceType: 'PROJECT', roleId: adminRole.id },
    { name: 'delete_project', value: true, resourceType: 'PROJECT', roleId: adminRole.id },

    { name: 'create_project', value: true, resourceType: 'PROJECT', roleId: managerRole.id },
    { name: 'edit_project', value: true, resourceType: 'PROJECT', roleId: managerRole.id },

    // Task permissions
    { name: 'create_task', value: true, resourceType: 'TASK', roleId: adminRole.id },
    { name: 'edit_task', value: true, resourceType: 'TASK', roleId: adminRole.id },
    { name: 'delete_task', value: true, resourceType: 'TASK', roleId: adminRole.id },

    { name: 'create_task', value: true, resourceType: 'TASK', roleId: managerRole.id },
    { name: 'edit_task', value: true, resourceType: 'TASK', roleId: managerRole.id },
    { name: 'delete_task', value: true, resourceType: 'TASK', roleId: managerRole.id },

    { name: 'create_task', value: true, resourceType: 'TASK', roleId: developerRole.id },
    { name: 'edit_task', value: true, resourceType: 'TASK', roleId: developerRole.id },

    { name: 'create_task', value: true, resourceType: 'TASK', roleId: designerRole.id },
    { name: 'edit_task', value: true, resourceType: 'TASK', roleId: designerRole.id },

    // Stream permissions
    { name: 'create', value: true, resourceType: 'STREAM', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: adminRole.id },
    { name: 'update', value: true, resourceType: 'STREAM', roleId: adminRole.id },
    { name: 'delete', value: true, resourceType: 'STREAM', roleId: adminRole.id },

    { name: 'create', value: true, resourceType: 'STREAM', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: managerRole.id },
    { name: 'update', value: true, resourceType: 'STREAM', roleId: managerRole.id },

    { name: 'read', value: true, resourceType: 'STREAM', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'STREAM', roleId: qaRole.id },

    // Channel permissions
    { name: 'create', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },
    { name: 'update', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },
    { name: 'delete', value: true, resourceType: 'CHANNEL', roleId: adminRole.id },

    { name: 'create', value: true, resourceType: 'CHANNEL', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: managerRole.id },
    { name: 'update', value: true, resourceType: 'CHANNEL', roleId: managerRole.id },

    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'CHANNEL', roleId: qaRole.id },

    // Team permissions
    { name: 'create', value: true, resourceType: 'TEAM', roleId: adminRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: adminRole.id },
    { name: 'update', value: true, resourceType: 'TEAM', roleId: adminRole.id },
    { name: 'delete', value: true, resourceType: 'TEAM', roleId: adminRole.id },

    { name: 'create', value: true, resourceType: 'TEAM', roleId: managerRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: managerRole.id },
    { name: 'update', value: true, resourceType: 'TEAM', roleId: managerRole.id },

    { name: 'read', value: true, resourceType: 'TEAM', roleId: developerRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: designerRole.id },
    { name: 'read', value: true, resourceType: 'TEAM', roleId: qaRole.id },
  ];

  await prisma.permission.createMany({ data: permissions });
  console.log('✅ Created permissions');

  // Create Workspace Members
  console.log('👥 Creating workspace members...');
  const member1 = await prisma.workspaceMember.create({
    data: {
      userId: mainUser.id,
      workspaceId: workspace.id,
      roleId: adminRole.id,
      status: 'ACTIVE',
    },
  });

  const member2 = await prisma.workspaceMember.create({
    data: {
      userId: user2.id,
      workspaceId: workspace.id,
      roleId: managerRole.id,
      status: 'ACTIVE',
    },
  });

  const member3 = await prisma.workspaceMember.create({
    data: {
      userId: user3.id,
      workspaceId: workspace.id,
      roleId: developerRole.id,
      status: 'ACTIVE',
    },
  });

  const member4 = await prisma.workspaceMember.create({
    data: {
      userId: user4.id,
      workspaceId: workspace.id,
      roleId: developerRole.id,
      status: 'ACTIVE',
    },
  });

  const member5 = await prisma.workspaceMember.create({
    data: {
      userId: user5.id,
      workspaceId: workspace.id,
      roleId: designerRole.id,
      status: 'ACTIVE',
    },
  });

  const member6 = await prisma.workspaceMember.create({
    data: {
      userId: user6.id,
      workspaceId: workspace.id,
      roleId: qaRole.id,
      status: 'ACTIVE',
    },
  });

  const member7 = await prisma.workspaceMember.create({
    data: {
      userId: user7.id,
      workspaceId: workspace.id,
      roleId: developerRole.id,
      status: 'ACTIVE',
    },
  });

  const member8 = await prisma.workspaceMember.create({
    data: {
      userId: user8.id,
      workspaceId: workspace.id,
      roleId: designerRole.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created 8 workspace members');

  // Create Streams
  console.log('🌊 Creating streams...');
  const engineeringStream = await prisma.stream.create({
    data: {
      name: 'Engineering',
      description: 'Software development and technical projects',
      workspaceId: workspace.id,
    },
  });

  const designStream = await prisma.stream.create({
    data: {
      name: 'Design',
      description: 'UI/UX design and creative work',
      workspaceId: workspace.id,
    },
  });

  const marketingStream = await prisma.stream.create({
    data: {
      name: 'Marketing',
      description: 'Marketing campaigns and product launches',
      workspaceId: workspace.id,
    },
  });

  console.log('✅ Created 3 streams');

  // Create Teams
  console.log('👨‍👩‍👧‍👦 Creating teams...');
  const backendTeam = await prisma.team.create({
    data: {
      name: 'Backend Team',
      streamId: engineeringStream.id,
    },
  });

  const frontendTeam = await prisma.team.create({
    data: {
      name: 'Frontend Team',
      streamId: engineeringStream.id,
    },
  });

  const designTeam = await prisma.team.create({
    data: {
      name: 'Design Team',
      streamId: designStream.id,
    },
  });

  console.log('✅ Created 3 teams');

  // Create Stream Members
  console.log('🔗 Assigning members to streams and teams...');
  await prisma.streamMember.createMany({
    data: [
      { workspaceMemberId: member1.id, streamId: engineeringStream.id, teamId: backendTeam.id },
      { workspaceMemberId: member2.id, streamId: engineeringStream.id, teamId: frontendTeam.id },
      { workspaceMemberId: member3.id, streamId: engineeringStream.id, teamId: backendTeam.id },
      { workspaceMemberId: member4.id, streamId: engineeringStream.id, teamId: frontendTeam.id },
      { workspaceMemberId: member5.id, streamId: designStream.id, teamId: designTeam.id },
      { workspaceMemberId: member6.id, streamId: engineeringStream.id, teamId: backendTeam.id },
      { workspaceMemberId: member7.id, streamId: engineeringStream.id, teamId: backendTeam.id },
      { workspaceMemberId: member8.id, streamId: designStream.id, teamId: designTeam.id },
    ],
  });

  console.log('✅ Created stream members');

  // Create Projects
  console.log('📁 Creating projects...');
  const project1 = await prisma.project.create({
    data: {
      name: 'Mobile App Redesign',
      description: 'Complete redesign of our mobile application with modern UI/UX',
      streamId: engineeringStream.id,
      teamId: frontendTeam.id,
      status: 'In Progress',
      startDate: new Date('2024-01-15'),
      dueDate: new Date('2024-06-30'),
      priority: 'High',
      logo: 'https://ui-avatars.com/api/?name=Mobile+App&background=10b981&color=fff',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'API Gateway Implementation',
      description: 'Build a scalable API gateway for microservices architecture',
      streamId: engineeringStream.id,
      teamId: backendTeam.id,
      status: 'In Progress',
      startDate: new Date('2024-02-01'),
      dueDate: new Date('2024-05-31'),
      priority: 'High',
      logo: 'https://ui-avatars.com/api/?name=API+Gateway&background=3b82f6&color=fff',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Design System 2.0',
      description: 'Create comprehensive design system with reusable components',
      streamId: designStream.id,
      teamId: designTeam.id,
      status: 'In Progress',
      startDate: new Date('2024-01-10'),
      dueDate: new Date('2024-04-30'),
      priority: 'Medium',
      logo: 'https://ui-avatars.com/api/?name=Design+System&background=f59e0b&color=fff',
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Build a full-featured e-commerce platform with payment integration',
      streamId: engineeringStream.id,
      teamId: backendTeam.id,
      status: 'Not Started',
      startDate: new Date('2024-07-01'),
      dueDate: new Date('2024-12-31'),
      priority: 'Medium',
      logo: 'https://ui-avatars.com/api/?name=E-commerce&background=ef4444&color=fff',
    },
  });

  console.log('✅ Created 4 projects');

  // Create Statuses for projects
  console.log('📊 Creating statuses...');
  const todoStatus1 = await prisma.status.create({
    data: { name: 'To Do', projectId: project1.id },
  });
  const inProgressStatus1 = await prisma.status.create({
    data: { name: 'In Progress', projectId: project1.id },
  });
  const reviewStatus1 = await prisma.status.create({
    data: { name: 'In Review', projectId: project1.id },
  });
  const doneStatus1 = await prisma.status.create({
    data: { name: 'Done', projectId: project1.id },
  });

  const todoStatus2 = await prisma.status.create({
    data: { name: 'To Do', projectId: project2.id },
  });
  const inProgressStatus2 = await prisma.status.create({
    data: { name: 'In Progress', projectId: project2.id },
  });
  const testingStatus2 = await prisma.status.create({
    data: { name: 'Testing', projectId: project2.id },
  });
  const doneStatus2 = await prisma.status.create({
    data: { name: 'Done', projectId: project2.id },
  });

  const todoStatus3 = await prisma.status.create({
    data: { name: 'To Do', projectId: project3.id },
  });
  const inProgressStatus3 = await prisma.status.create({
    data: { name: 'In Progress', projectId: project3.id },
  });
  const doneStatus3 = await prisma.status.create({
    data: { name: 'Done', projectId: project3.id },
  });

  console.log('✅ Created statuses');

  // Create Boards
  console.log('📋 Creating boards...');
  const board1 = await prisma.board.create({
    data: {
      name: 'Mobile App Board',
      projectId: project1.id,
    },
  });

  const board2 = await prisma.board.create({
    data: {
      name: 'API Gateway Board',
      projectId: project2.id,
    },
  });

  const board3 = await prisma.board.create({
    data: {
      name: 'Design System Board',
      projectId: project3.id,
    },
  });

  console.log('✅ Created 3 boards');

  // Create Issue Types
  console.log('🏷️ Creating issue types...');
  await prisma.issueType.createMany({
    data: [
      { name: 'Bug', iconUrl: '🐛', boardId: board1.id },
      { name: 'Feature', iconUrl: '✨', boardId: board1.id },
      { name: 'Task', iconUrl: '✓', boardId: board1.id },
      { name: 'Bug', iconUrl: '🐛', boardId: board2.id },
      { name: 'Feature', iconUrl: '✨', boardId: board2.id },
      { name: 'Task', iconUrl: '✓', boardId: board2.id },
      { name: 'Design', iconUrl: '🎨', boardId: board3.id },
      { name: 'Component', iconUrl: '🧩', boardId: board3.id },
    ],
  });

  console.log('✅ Created issue types');

  // Create Columns
  console.log('📌 Creating board columns...');
  const column1_1 = await prisma.column.create({
    data: {
      name: 'To Do',
      statusId: todoStatus1.id,
      boardId: board1.id,
      isInitial: true,
    },
  });

  const column1_2 = await prisma.column.create({
    data: {
      name: 'In Progress',
      statusId: inProgressStatus1.id,
      boardId: board1.id,
    },
  });

  const column1_3 = await prisma.column.create({
    data: {
      name: 'In Review',
      statusId: reviewStatus1.id,
      boardId: board1.id,
    },
  });

  const column1_4 = await prisma.column.create({
    data: {
      name: 'Done',
      statusId: doneStatus1.id,
      boardId: board1.id,
    },
  });

  const column2_1 = await prisma.column.create({
    data: {
      name: 'To Do',
      statusId: todoStatus2.id,
      boardId: board2.id,
      isInitial: true,
    },
  });

  const column2_2 = await prisma.column.create({
    data: {
      name: 'In Progress',
      statusId: inProgressStatus2.id,
      boardId: board2.id,
    },
  });

  const column2_3 = await prisma.column.create({
    data: {
      name: 'Testing',
      statusId: testingStatus2.id,
      boardId: board2.id,
    },
  });

  const column2_4 = await prisma.column.create({
    data: {
      name: 'Done',
      statusId: doneStatus2.id,
      boardId: board2.id,
    },
  });

  console.log('✅ Created columns');

  // Create Sprints
  console.log('🏃 Creating sprints...');
  const sprint1_1 = await prisma.sprint.create({
    data: {
      name: 'Sprint 1 - Foundation',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-28'),
      position: 1,
      goal: 'Set up project foundation and core architecture',
      state: 'Completed',
      projectId: project1.id,
    },
  });

  const sprint1_2 = await prisma.sprint.create({
    data: {
      name: 'Sprint 2 - UI Components',
      startDate: new Date('2024-01-29'),
      endDate: new Date('2024-02-11'),
      position: 2,
      goal: 'Implement core UI components',
      state: 'Active',
      projectId: project1.id,
    },
  });

  const sprint1_3 = await prisma.sprint.create({
    data: {
      name: 'Sprint 3 - Features',
      startDate: new Date('2024-02-12'),
      endDate: new Date('2024-02-25'),
      position: 3,
      goal: 'Build main features and workflows',
      state: 'Inactive',
      projectId: project1.id,
    },
  });

  const sprint2_1 = await prisma.sprint.create({
    data: {
      name: 'Sprint 1 - Setup',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-14'),
      position: 1,
      goal: 'Gateway architecture and setup',
      state: 'Active',
      projectId: project2.id,
    },
  });

  console.log('✅ Created 4 sprints');

  // Create Tasks
  console.log('✅ Creating tasks...');
  const task1 = await prisma.task.create({
    data: {
      key: 'MAR-1',
      description: 'Design and implement new login screen with biometric authentication',
      projectId: project1.id,
      statusId: doneStatus1.id,
      dueDate: new Date('2024-02-05'),
      priority: 'High',
      labels: ['frontend', 'authentication', 'ui'],
      reporterId: mainUser.id,
      assigneeId: user4.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      key: 'MAR-2',
      description: 'Create reusable button component library with variants',
      projectId: project1.id,
      statusId: inProgressStatus1.id,
      dueDate: new Date('2024-02-15'),
      priority: 'Medium',
      labels: ['frontend', 'components'],
      reporterId: user2.id,
      assigneeId: user5.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      key: 'MAR-3',
      description: 'Implement dark mode theme support across the application',
      projectId: project1.id,
      statusId: todoStatus1.id,
      dueDate: new Date('2024-02-20'),
      priority: 'Medium',
      labels: ['frontend', 'theming'],
      reporterId: user2.id,
      assigneeId: user8.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      key: 'MAR-4',
      description: 'Fix navigation drawer animation performance issues',
      projectId: project1.id,
      statusId: reviewStatus1.id,
      dueDate: new Date('2024-02-10'),
      priority: 'High',
      labels: ['frontend', 'bug', 'performance'],
      reporterId: user2.id,
      assigneeId: user4.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      key: 'API-1',
      description: 'Set up API Gateway infrastructure with Kong',
      projectId: project2.id,
      statusId: doneStatus2.id,
      dueDate: new Date('2024-02-08'),
      priority: 'High',
      labels: ['backend', 'infrastructure'],
      reporterId: mainUser.id,
      assigneeId: user3.id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      key: 'API-2',
      description: 'Implement rate limiting and throttling middleware',
      projectId: project2.id,
      statusId: inProgressStatus2.id,
      dueDate: new Date('2024-02-18'),
      priority: 'High',
      labels: ['backend', 'security'],
      reporterId: mainUser.id,
      assigneeId: user7.id,
    },
  });

  const task7 = await prisma.task.create({
    data: {
      key: 'API-3',
      description: 'Create authentication and authorization plugins',
      projectId: project2.id,
      statusId: inProgressStatus2.id,
      dueDate: new Date('2024-02-20'),
      priority: 'High',
      labels: ['backend', 'security', 'authentication'],
      reporterId: user2.id,
      assigneeId: user3.id,
    },
  });

  const task8 = await prisma.task.create({
    data: {
      key: 'API-4',
      description: 'Set up monitoring and logging for gateway metrics',
      projectId: project2.id,
      statusId: todoStatus2.id,
      dueDate: new Date('2024-02-25'),
      priority: 'Medium',
      labels: ['backend', 'monitoring', 'observability'],
      reporterId: mainUser.id,
      assigneeId: user7.id,
    },
  });

  const task9 = await prisma.task.create({
    data: {
      key: 'DS-1',
      description: 'Define color palette and typography system',
      projectId: project3.id,
      statusId: doneStatus3.id,
      dueDate: new Date('2024-01-25'),
      priority: 'High',
      labels: ['design', 'foundation'],
      reporterId: user5.id,
      assigneeId: user5.id,
    },
  });

  const task10 = await prisma.task.create({
    data: {
      key: 'DS-2',
      description: 'Create icon library with SVG assets',
      projectId: project3.id,
      statusId: inProgressStatus3.id,
      dueDate: new Date('2024-02-15'),
      priority: 'Medium',
      labels: ['design', 'icons'],
      reporterId: user5.id,
      assigneeId: user8.id,
    },
  });

  // Create subtasks
  const subtask1 = await prisma.task.create({
    data: {
      key: 'MAR-2-1',
      description: 'Design button variants (primary, secondary, outlined)',
      projectId: project1.id,
      statusId: doneStatus1.id,
      priority: 'Medium',
      labels: ['frontend', 'design'],
      reporterId: user2.id,
      assigneeId: user5.id,
      parentId: task2.id,
    },
  });

  const subtask2 = await prisma.task.create({
    data: {
      key: 'MAR-2-2',
      description: 'Implement button component with TypeScript',
      projectId: project1.id,
      statusId: inProgressStatus1.id,
      priority: 'Medium',
      labels: ['frontend', 'implementation'],
      reporterId: user2.id,
      assigneeId: user4.id,
      parentId: task2.id,
    },
  });

  console.log('✅ Created 12 tasks');

  // Create Checklist Items
  console.log('☑️ Creating checklist items...');
  await prisma.checklistItem.createMany({
    data: [
      { taskId: task1.id, content: 'Research biometric libraries', isDone: true },
      { taskId: task1.id, content: 'Design UI mockups', isDone: true },
      { taskId: task1.id, content: 'Implement biometric API integration', isDone: true },
      { taskId: task1.id, content: 'Write unit tests', isDone: true },
      { taskId: task2.id, content: 'Define button API props', isDone: true },
      { taskId: task2.id, content: 'Implement base button component', isDone: true },
      { taskId: task2.id, content: 'Add variants and sizes', isDone: false },
      { taskId: task2.id, content: 'Write Storybook stories', isDone: false },
      { taskId: task6.id, content: 'Research rate limiting algorithms', isDone: true },
      { taskId: task6.id, content: 'Configure Redis for rate limit storage', isDone: true },
      { taskId: task6.id, content: 'Implement sliding window algorithm', isDone: false },
      { taskId: task6.id, content: 'Add configuration options', isDone: false },
    ],
  });

  console.log('✅ Created checklist items');

  // Create Task Dependencies
  console.log('🔗 Creating task dependencies...');
  await prisma.dependency.createMany({
    data: [
      { taskId: task2.id, dependsOn: task1.id },
      { taskId: task3.id, dependsOn: task2.id },
      { taskId: task7.id, dependsOn: task5.id },
      { taskId: task8.id, dependsOn: task6.id },
    ],
  });

  console.log('✅ Created task dependencies');

  // Create Cards
  console.log('🃏 Creating cards...');
  const card1 = await prisma.card.create({
    data: {
      issueId: task1.id,
      done: true,
      sprintId: sprint1_1.id,
      priority: 1,
      columnId: column1_4.id,
      projectId: project1.id,
    },
  });

  const card2 = await prisma.card.create({
    data: {
      issueId: task2.id,
      done: false,
      sprintId: sprint1_2.id,
      priority: 2,
      columnId: column1_2.id,
      projectId: project1.id,
    },
  });

  const card3 = await prisma.card.create({
    data: {
      issueId: task3.id,
      done: false,
      sprintId: sprint1_3.id,
      priority: 3,
      columnId: column1_1.id,
      projectId: project1.id,
    },
  });

  const card4 = await prisma.card.create({
    data: {
      issueId: task4.id,
      done: false,
      sprintId: sprint1_2.id,
      priority: 1,
      columnId: column1_3.id,
      projectId: project1.id,
    },
  });

  const card5 = await prisma.card.create({
    data: {
      issueId: task5.id,
      done: true,
      sprintId: sprint2_1.id,
      priority: 1,
      columnId: column2_4.id,
      projectId: project2.id,
    },
  });

  const card6 = await prisma.card.create({
    data: {
      issueId: task6.id,
      done: false,
      sprintId: sprint2_1.id,
      priority: 2,
      columnId: column2_2.id,
      projectId: project2.id,
    },
  });

  const card7 = await prisma.card.create({
    data: {
      issueId: task7.id,
      done: false,
      sprintId: sprint2_1.id,
      priority: 3,
      columnId: column2_2.id,
      projectId: project2.id,
    },
  });

  console.log('✅ Created 7 cards');

  // Create Channels
  console.log('💬 Creating channels...');
  const generalChannel = await prisma.channel.create({
    data: {
      name: 'general',
      description: 'General workspace discussions',
      type: 'GROUP',
      isDirect: false,
      workspaceId: workspace.id,
    },
  });

  const engineeringChannel = await prisma.channel.create({
    data: {
      name: 'engineering',
      description: 'Engineering team discussions',
      type: 'GROUP',
      isDirect: false,
      workspaceId: workspace.id,
      streamId: engineeringStream.id,
    },
  });

  const designChannel = await prisma.channel.create({
    data: {
      name: 'design',
      description: 'Design team discussions',
      type: 'GROUP',
      isDirect: false,
      workspaceId: workspace.id,
      streamId: designStream.id,
    },
  });

  const mobileAppChannel = await prisma.channel.create({
    data: {
      name: 'mobile-app-redesign',
      description: 'Discussion about mobile app redesign project',
      type: 'GROUP',
      isDirect: false,
      workspaceId: workspace.id,
      streamId: engineeringStream.id,
    },
  });

  const directChannel1 = await prisma.channel.create({
    data: {
      name: 'Alex & Sarah',
      type: 'DIRECT',
      isDirect: true,
      workspaceId: workspace.id,
    },
  });

  console.log('✅ Created 5 channels');

  // Create Channel Members
  console.log('👥 Adding members to channels...');
  const channelMember1 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: mainUser.id },
  });
  const channelMember2 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user2.id },
  });
  const channelMember3 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user3.id },
  });
  const channelMember4 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user4.id },
  });
  const channelMember5 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user5.id },
  });
  const channelMember6 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user6.id },
  });
  const channelMember7 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user7.id },
  });
  const channelMember8 = await prisma.channelMember.create({
    data: { channelId: generalChannel.id, userId: user8.id },
  });

  const engChannelMember1 = await prisma.channelMember.create({
    data: { channelId: engineeringChannel.id, userId: mainUser.id },
  });
  const engChannelMember2 = await prisma.channelMember.create({
    data: { channelId: engineeringChannel.id, userId: user2.id },
  });
  const engChannelMember3 = await prisma.channelMember.create({
    data: { channelId: engineeringChannel.id, userId: user3.id },
  });
  const engChannelMember4 = await prisma.channelMember.create({
    data: { channelId: engineeringChannel.id, userId: user4.id },
  });
  const engChannelMember5 = await prisma.channelMember.create({
    data: { channelId: engineeringChannel.id, userId: user7.id },
  });

  const designChannelMember1 = await prisma.channelMember.create({
    data: { channelId: designChannel.id, userId: user5.id },
  });
  const designChannelMember2 = await prisma.channelMember.create({
    data: { channelId: designChannel.id, userId: user8.id },
  });

  const mobileChannelMember1 = await prisma.channelMember.create({
    data: { channelId: mobileAppChannel.id, userId: mainUser.id },
  });
  const mobileChannelMember2 = await prisma.channelMember.create({
    data: { channelId: mobileAppChannel.id, userId: user2.id },
  });
  const mobileChannelMember3 = await prisma.channelMember.create({
    data: { channelId: mobileAppChannel.id, userId: user4.id },
  });
  const mobileChannelMember4 = await prisma.channelMember.create({
    data: { channelId: mobileAppChannel.id, userId: user5.id },
  });

  const directChannelMember1 = await prisma.channelMember.create({
    data: { channelId: directChannel1.id, userId: mainUser.id },
  });
  const directChannelMember2 = await prisma.channelMember.create({
    data: { channelId: directChannel1.id, userId: user2.id },
  });

  console.log('✅ Created channel members');

  // Create Messages
  console.log('💌 Creating messages...');
  await prisma.message.create({
    data: {
      text: 'Welcome to TechVentures Inc! 🎉 Excited to have everyone on board.',
      originalLanguage: 'en',
      channelId: generalChannel.id,
      senderId: channelMember1.id,
      isPinned: true,
      createdAt: new Date('2024-01-10T09:00:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Thanks Alex! Looking forward to working with this amazing team.',
      originalLanguage: 'en',
      channelId: generalChannel.id,
      senderId: channelMember2.id,
      createdAt: new Date('2024-01-10T09:15:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Hey team! I just completed the login screen implementation. Ready for review.',
      originalLanguage: 'en',
      channelId: engineeringChannel.id,
      senderId: engChannelMember4.id,
      createdAt: new Date('2024-02-05T14:30:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Great work! I\'ll review it this afternoon.',
      originalLanguage: 'en',
      channelId: engineeringChannel.id,
      senderId: engChannelMember2.id,
      createdAt: new Date('2024-02-05T14:45:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'The new button component library is coming along nicely. Here\'s the Figma link.',
      originalLanguage: 'en',
      channelId: mobileAppChannel.id,
      senderId: mobileChannelMember4.id,
      isPinned: true,
      createdAt: new Date('2024-02-12T10:00:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Looking good! Can we add a focus state for accessibility?',
      originalLanguage: 'en',
      channelId: mobileAppChannel.id,
      senderId: mobileChannelMember2.id,
      createdAt: new Date('2024-02-12T10:30:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Sarah, can we schedule a quick call about the API Gateway architecture?',
      originalLanguage: 'en',
      channelId: directChannel1.id,
      senderId: directChannelMember1.id,
      createdAt: new Date('2024-02-14T15:00:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Sure! How about 3pm today?',
      originalLanguage: 'en',
      channelId: directChannel1.id,
      senderId: directChannelMember2.id,
      createdAt: new Date('2024-02-14T15:05:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'The design system color palette has been finalized. Check out the updated style guide!',
      originalLanguage: 'en',
      channelId: designChannel.id,
      senderId: designChannelMember1.id,
      isPinned: true,
      createdAt: new Date('2024-01-25T11:00:00Z'),
    },
  });

  await prisma.message.create({
    data: {
      text: 'Perfect! I\'ll start working on the icon library now.',
      originalLanguage: 'en',
      channelId: designChannel.id,
      senderId: designChannelMember2.id,
      createdAt: new Date('2024-01-25T11:20:00Z'),
    },
  });

  console.log('✅ Created 10 messages');

  // Create Activities
  console.log('📊 Creating activities...');
  await prisma.activity.createMany({
    data: [
      {
        type: 'PROJECT_CREATED',
        description: 'Created project "Mobile App Redesign"',
        projectId: project1.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-15T08:00:00Z'),
      },
      {
        type: 'PROJECT_CREATED',
        description: 'Created project "API Gateway Implementation"',
        projectId: project2.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-02-01T08:00:00Z'),
      },
      {
        type: 'PROJECT_CREATED',
        description: 'Created project "Design System 2.0"',
        projectId: project3.id,
        streamId: designStream.id,
        workspaceId: workspace.id,
        userId: user5.id,
        createdAt: new Date('2024-01-10T08:00:00Z'),
      },
      {
        type: 'TASK_CREATED',
        description: 'Created task "Design and implement new login screen"',
        taskId: task1.id,
        projectId: project1.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-16T09:00:00Z'),
      },
      {
        type: 'TASK_ASSIGN_USER',
        description: 'Assigned Emily Davis to task "Design and implement new login screen"',
        taskId: task1.id,
        projectId: project1.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-16T09:05:00Z'),
      },
      {
        type: 'TASK_COMPLETED',
        description: 'Completed task "Design and implement new login screen"',
        taskId: task1.id,
        projectId: project1.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: user4.id,
        createdAt: new Date('2024-02-05T16:00:00Z'),
      },
      {
        type: 'TASK_CREATED',
        description: 'Created task "Create reusable button component library"',
        taskId: task2.id,
        projectId: project1.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: user2.id,
        createdAt: new Date('2024-02-06T10:00:00Z'),
      },
      {
        type: 'TASK_SET_STATUS',
        description: 'Changed status to "In Progress"',
        taskId: task2.id,
        projectId: project1.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: user5.id,
        createdAt: new Date('2024-02-10T14:00:00Z'),
      },
      {
        type: 'USER_JOINED',
        description: 'Alex Johnson joined the workspace',
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-05T08:00:00Z'),
      },
      {
        type: 'USER_JOINED',
        description: 'Sarah Wilson joined the workspace',
        workspaceId: workspace.id,
        userId: user2.id,
        createdAt: new Date('2024-01-06T08:00:00Z'),
      },
      {
        type: 'USER_JOINED',
        description: 'Michael Chen joined the workspace',
        workspaceId: workspace.id,
        userId: user3.id,
        createdAt: new Date('2024-01-06T09:00:00Z'),
      },
      {
        type: 'STREAM_CREATED',
        description: 'Created stream "Engineering"',
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-08T10:00:00Z'),
      },
      {
        type: 'STREAM_CREATED',
        description: 'Created stream "Design"',
        streamId: designStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-08T10:05:00Z'),
      },
      {
        type: 'CHANNEL_CREATED',
        description: 'Created channel "general"',
        channelId: generalChannel.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-09T08:00:00Z'),
      },
      {
        type: 'CHANNEL_CREATED',
        description: 'Created channel "engineering"',
        channelId: engineeringChannel.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-09T08:15:00Z'),
      },
      {
        type: 'TEAM_CREATED',
        description: 'Created team "Backend Team"',
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-12T09:00:00Z'),
      },
      {
        type: 'TEAM_CREATED',
        description: 'Created team "Frontend Team"',
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-01-12T09:05:00Z'),
      },
      {
        type: 'TASK_SET_PRIORITY',
        description: 'Changed priority to "High"',
        taskId: task6.id,
        projectId: project2.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-02-15T11:00:00Z'),
      },
      {
        type: 'TASK_ADD_LABEL',
        description: 'Added label "security"',
        taskId: task6.id,
        projectId: project2.id,
        streamId: engineeringStream.id,
        workspaceId: workspace.id,
        userId: mainUser.id,
        createdAt: new Date('2024-02-15T11:05:00Z'),
      },
    ],
  });

  console.log('✅ Created 19 activities');

  // Update workspace with default workspace ID for main user
  await prisma.user.update({
    where: { id: mainUser.id },
    data: { defaultWorkspaceId: workspace.id },
  });

  console.log('✅ Updated default workspace for main user');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Summary:');
  console.log('   - 8 Users created');
  console.log('   - 1 Workspace created: TechVentures Inc');
  console.log('   - 5 Roles created (Admin, Project Manager, Developer, Designer, QA Engineer)');
  console.log('   - Permissions configured for all roles');
  console.log('   - 3 Streams created (Engineering, Design, Marketing)');
  console.log('   - 3 Teams created (Backend, Frontend, Design)');
  console.log('   - 4 Projects created with boards and sprints');
  console.log('   - 12 Tasks created with subtasks, checklists, and dependencies');
  console.log('   - 7 Cards created across different boards');
  console.log('   - 5 Channels created with members');
  console.log('   - 10 Messages created across channels');
  console.log('   - 19 Activities logged');
  console.log('\n👤 Test User Credentials:');
  console.log('   Email: test@gmail.com');
  console.log('   Password: Test@1234');
  console.log('\n🔑 Additional Test Users:');
  console.log('   - sarah.wilson@gmail.com');
  console.log('   - michael.chen@gmail.com');
  console.log('   - emily.davis@gmail.com');
  console.log('   - carlos.rodriguez@gmail.com');
  console.log('   - priya.patel@gmail.com');
  console.log('   - james.brown@gmail.com');
  console.log('   - lisa.anderson@gmail.com');
  console.log('   All passwords: Test@1234\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
