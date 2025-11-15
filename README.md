# Dialect Backend V2

> **A production-ready GraphQL API for a collaborative project management platform with real-time features**

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture & Design](#architecture--design)
- [Implemented Features](#implemented-features)
- [Work In Progress](#work-in-progress)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Why This Codebase](#why-this-codebase)

---

## Overview
Dialect Backend V2 is a comprehensive GraphQL API backend for a project management and team collaboration platform. Built with NestJS and Prisma, it provides real-time capabilities through GraphQL subscriptions, robust authentication, fine-grained role-based access control (RBAC), and multi-workspace support. The platform enables teams to manage projects, tasks, sprints, communicate through channels, and track activities across workspaces.

**Key Capabilities:**
- Multi-workspace team collaboration
- Real-time messaging and notifications via GraphQL subscriptions
- Granular permission system with custom roles
- Project and task management with dependencies and checklists
- Stream-based project organization
- Activity tracking and audit logs
- Multi-language translation support (Azure Cognitive Services integration)

---

## Tech Stack

### Core Framework & Language
- **NestJS** - Enterprise-grade Node.js framework with dependency injection
- **TypeScript** - Type-safe development with full IntelliSense support
- **GraphQL** - Flexible API with Apollo Server integration

### Database & ORM
- **Prisma** - Next-generation TypeScript ORM with type-safe database queries
- **PostgreSQL** - Primary database (production-ready schema design)
- **Redis** - In-memory data store for real-time pub/sub and caching

### Authentication & Security
- **JWT** - Token-based authentication with refresh token rotation
- **bcrypt** - Secure password hashing
- **Cookie-based** auth storage for enhanced security

### Real-time Features
- **graphql-redis-subscriptions** - Redis-backed GraphQL subscriptions
- **IORedis** - High-performance Redis client

### File Handling & Communication
- **graphql-upload** - File upload support for avatars, attachments, and voice messages
- **Nodemailer** - Email service for invitations and notifications

### External Integrations
- **Azure Cognitive Services** - Multi-language translation API integration
- **Axios** - HTTP client for external API calls

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerized development and deployment
- **Multi-stage Dockerfile** - Optimized production builds

### Code Quality & Testing
- **Jest** - Unit and integration testing framework
- **ESLint & Prettier** - Code formatting and linting
- **class-validator & class-transformer** - DTO validation

---

## Architecture & Design

### 🏛️ **Modular Architecture**
The codebase follows a **domain-driven design** approach with clear separation of concerns:

```
src/
├── auth/           # Authentication & authorization
├── user/           # User profile management
├── workspace/      # Multi-tenant workspace system
├── roles/          # Custom role creation & management
├── permission/     # Fine-grained permission system
├── stream/         # Project stream organization
├── project/        # Project management
├── task/           # Task tracking with dependencies
├── board/          # Kanban board functionality
├── sprint/         # Sprint management (WIP)
├── team/           # Team creation & member management
├── channel/        # Communication channels (WIP)
├── message/        # Real-time messaging
├── activities/     # Activity logging & audit trail
├── translation/    # Multi-language support
├── email/          # Email notifications
└── token/          # JWT token management
```

Each module is **self-contained** with:
- Resolver (GraphQL endpoint definitions)
- Service (business logic)
- DTOs (input validation)
- Types (GraphQL schema types)
- Spec files (unit tests)

### 🔐 **Security Architecture**
- **GraphQL Auth Guard** - JWT validation on protected routes
- **Permissions Guard** - Resource-based access control
- **Custom Decorators** - `@Permissions()` for declarative RBAC
- **Token Service** - Centralized token validation and extraction
- **Secure WebSocket** - Authentication for GraphQL subscriptions

### 🗄️ **Database Design**
Prisma schema split into logical domains:
```
prisma/schema/
├── user.prisma         # User accounts & profiles
├── workspace.prisma    # Workspace & membership
├── role.prisma         # Custom roles
├── permission.prisma   # Permission definitions
├── stream.prisma       # Project streams
├── project.prisma      # Projects
├── task.prisma         # Tasks with dependencies
├── boards.prisma       # Kanban boards
├── card.prisma         # Board cards
├── column.prisma       # Board columns
├── sprint.prisma       # Sprint planning
├── teams.prisma        # Teams
├── channel.prisma      # Chat channels
├── message.prisma      # Messages
└── activities.prisma   # Activity logs
```

### 📡 **Real-time System**
- **Redis Pub/Sub** - Distributed event broadcasting
- **GraphQL Subscriptions** - Real-time updates to clients
- **Retry Strategy** - Resilient Redis reconnection logic
- **Context Injection** - User authentication in WebSocket connections

---

## Implemented Features

### ✅ **Authentication & User Management**
- [x] User registration with email/password
- [x] Login with JWT token generation
- [x] Refresh token rotation
- [x] Secure logout (token invalidation)
- [x] User profile management
- [x] Avatar upload
- [x] Default workspace selection

### ✅ **Workspace Management**
- [x] Multi-workspace support (create, update, delete)
- [x] Workspace logo upload
- [x] Workspace settings (team size, AI toggle, invite links)
- [x] Member invitation system (email invites)
- [x] Add/remove workspace members
- [x] Workspace-level activity tracking

### ✅ **Role-Based Access Control (RBAC)**
- [x] Custom role creation per workspace
- [x] Granular permission system (create, read, update, delete, add-members, remove-member)
- [x] Resource-based permissions (workspace, stream, project, task, team, channel)
- [x] Permission guards with declarative syntax
- [x] Role assignment to users

### ✅ **Stream Management**
- [x] Create project streams within workspaces
- [x] Add/remove stream members
- [x] Stream deletion
- [x] Permission-based stream access

### ✅ **Project Management**
- [x] Create projects within streams
- [x] Fetch projects by stream
- [x] Project-level permissions
- [x] Project activity tracking

### ✅ **Task Management**
- [x] Create, update, delete tasks
- [x] Task dependencies (blocking relationships)
- [x] Checklist items for tasks
- [x] Task assignment
- [x] Task status tracking
- [x] Backlog management
- [x] Task summary/statistics
- [x] Real-time task updates via subscriptions

### ✅ **Kanban Board**
- [x] Board creation per project
- [x] Dynamic columns
- [x] Card management
- [x] Drag-and-drop card movement
- [x] Backlog view

### ✅ **Team Management**
- [x] Create teams within streams
- [x] Add/remove team members
- [x] Team deletion
- [x] Fetch teams by stream

### ✅ **Messaging System**
- [x] Send text messages
- [x] Image attachments
- [x] Voice message uploads
- [x] Message editing
- [x] Message deletion
- [x] Pin important messages
- [x] Fetch channel messages

### ✅ **Activity Tracking**
- [x] User activity logs
- [x] Project-level activities
- [x] Stream-level activities
- [x] Workspace-level activities
- [x] Task-level activities
- [x] Automatic activity creation on CRUD operations

### ✅ **Translation Service**
- [x] Azure Cognitive Services integration
- [x] Multi-language message translation
- [x] Cached language detection
- [x] Automatic translation storage

### ✅ **Infrastructure**
- [x] Docker containerization
- [x] Docker Compose orchestration
- [x] Multi-stage Docker builds
- [x] Redis integration
- [x] Static file serving
- [x] Environment-based configuration
- [x] Production/development mode toggles

---

## Work In Progress

### 🚧 **Channel Management**
- [ ] Create/update/delete channels
- [ ] Channel member management
- [ ] Public/private channel types
- [ ] Channel notifications

### 🚧 **Sprint Management**
- [ ] Sprint creation and planning
- [ ] Sprint backlog
- [ ] Sprint velocity tracking
- [ ] Burndown charts

### 🚧 **Advanced Features**
- [ ] File attachment management system
- [ ] Real-time notifications service
- [ ] Webhooks for external integrations
- [ ] Advanced search and filtering
- [ ] GraphQL subscriptions for all real-time events
- [ ] Rate limiting and API throttling
- [ ] Audit logs export
- [ ] Data export functionality

### 🚧 **Testing & Documentation**
- [ ] Increase test coverage (currently partial)
- [ ] E2E test suite
- [ ] API documentation generation
- [ ] Postman/Insomnia collection
- [ ] Migration guides

### 🚧 **Performance Optimization**
- [ ] Database query optimization
- [ ] Caching layer expansion
- [ ] CDN integration for file uploads
- [ ] GraphQL query complexity analysis

---

## API Documentation

### GraphQL Playground
Access the interactive GraphQL Playground at `http://localhost:3500/graphql` (development mode only)

### Sample Queries & Mutations

#### Authentication
```graphql
# Register a new user
mutation {
  register(registerInput: {
    email: "user@example.com"
    password: "SecurePass123"
    confirmPassword: "SecurePass123"
    fullname: "John Doe"
  }) {
    user {
      id
      email
      fullname
    }
  }
}

# Login
mutation {
  login(loginInput: {
    email: "user@example.com"
    password: "SecurePass123"
  }) {
    user {
      id
      email
      fullname
    }
  }
}
```

#### Workspace Management
```graphql
# Create workspace
mutation {
  createWorkspace(name: "My Workspace") {
    id
    name
    createdAt
  }
}

# Get user profile with workspaces
query {
  me {
    id
    email
    fullname
    workspaces {
      id
      name
    }
  }
}
```

#### Task Management
```graphql
# Create a task
mutation {
  createTask(data: {
    title: "Implement feature"
    description: "Build new feature"
    projectId: "project-id"
    priority: HIGH
    status: TODO
  }) {
    id
    title
    status
    priority
  }
}

# Subscribe to task updates
subscription {
  taskCreated {
    id
    title
    status
  }
}
```

---


## 🎯 **What I'm Proud Of**

#### 1. **Clean, Scalable Architecture**
- **Modular design**: Each feature is isolated in its own module with clear boundaries
- **Dependency injection**: Fully leverages NestJS DI for testability and maintainability
- **Type safety**: End-to-end TypeScript with Prisma-generated types
- **Separation of concerns**: Resolvers handle requests, services contain business logic, DTOs validate input

#### 2. **Production-Ready Patterns**
- **Authentication & Security**: JWT with refresh tokens, secure WebSocket authentication, bcrypt password hashing
- **RBAC System**: Fine-grained, resource-based permissions with custom roles
- **Error Handling**: Custom exception filters for consistent error responses
- **Environment Configuration**: Proper separation of dev/prod configs
- **Docker Multi-stage Builds**: Optimized container images for production

#### 3. **Real-time Capabilities**
- **GraphQL Subscriptions**: Redis-backed pub/sub for horizontal scalability
- **Resilient Connections**: Automatic retry strategy for Redis failures
- **Authenticated WebSockets**: Secure real-time connections with token validation

#### 4. **Developer Experience**
- **Code Quality**: Prettier + ESLint for consistent formatting
- **Testing Setup**: Jest configured for unit and E2E tests
- **Hot Reload**: Fast development iteration with watch mode
- **Clear Scripts**: Well-organized npm scripts for common tasks
- **Comprehensive README**: Detailed documentation for onboarding

#### 5. **Database Excellence**
- **Schema Organization**: Prisma schema split into logical files
- **Type-Safe Queries**: No raw SQL, all queries are type-checked
- **Migration System**: Version-controlled database changes
- **Lifecycle Management**: Proper connection handling with `OnModuleInit`

#### 6. **Code Readability**
- **Consistent Naming**: Clear, descriptive names for files, classes, and methods
- **Self-Documenting**: Code structure that explains intent
- **Focused Functions**: Small, single-responsibility methods
- **DTOs for Validation**: Input validation separated from business logic

#### 7. **Problem-Solving Approach**
- **Azure Integration**: Third-party API integration with proper error handling
- **File Uploads**: Handling multipart GraphQL uploads for images/voice
- **Activity Tracking**: Automatic audit trail generation
- **Permission System**: Complex authorization logic abstracted into decorators

---

## Project Structure Highlights

```
dialect_api_v2/
├── docker-compose.yml      # Multi-service orchestration
├── dockerfile              # Multi-stage production build
├── prisma/
│   └── schema/            # Modular Prisma schemas
├── src/
│   ├── app.module.ts      # Root module with GraphQL config
│   ├── prisma.services.ts # Database connection service
│   ├── GlobalHttpModule.ts # Shared HTTP client
│   ├── filters/           # Custom exception filters
│   ├── auth/              # JWT authentication
│   ├── workspace/         # Multi-tenant workspaces
│   ├── roles/             # Custom RBAC
│   ├── permission/        # Permission guards
│   ├── project/           # Project management
│   ├── task/              # Task tracking
│   ├── message/           # Real-time messaging
│   ├── translation/       # Azure translation
│   └── activities/        # Audit logging
├── test/                  # E2E tests
└── public/                # Static file serving
```

---

## Docker Commands

### Development
```bash
# Start all services
docker-compose up

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f app

# Access container shell
docker exec -it dialect-backend sh

# Run Prisma commands
docker exec -it dialect-backend npx prisma studio
docker exec -it dialect-backend npx prisma migrate dev
```

### Production
```bash
# Build production image
docker build -t dialect-api:latest .

# Run production container
docker run -p 3000:3000 --env-file .env.production dialect-api:latest
```

---

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## Scripts

```bash
npm run start          # Start production server
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start in debug mode
npm run build          # Build for production
npm run format         # Format code with Prettier
npm run lint           # Lint and fix code
npm run test           # Run unit tests
npm run test:e2e       # Run E2E tests
```

---

## Contributing

This is a portfolio project. For questions or feedback, please open an issue or contact me directly.

---

## License

UNLICENSED - This is a public portfolio project.

---

## Contact

**Developer**: Olamidotun IY
**Repository**: [github.com/OlamidotunIY/dialect_api_v2](https://github.com/OlamidotunIY/dialect_api_v2)
**Project Type**: Full-Stack Project Management Platform (Backend)

---

**Built with ❤️ using NestJS, GraphQL, Prisma, and TypeScript**
