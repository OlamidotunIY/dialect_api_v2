import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { TokenService } from './token/token.service';
import { WorkspaceService } from './workspace/workspace.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { RolesService } from './roles/roles.service';
import { RolesModule } from './roles/roles.module';
import { StreamService } from './stream/stream.service';
import { StreamModule } from './stream/stream.module';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';
import { EmailService } from './email/email.service';
import { PermissionService } from './permission/permission.service';
import { PrismaService } from './prisma.services';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TeamService } from './team/team.service';
import { TeamResolver } from './team/team.resolver';
import { TeamModule } from './team/team.module';
import { JwtService } from '@nestjs/jwt';
import { ActivitiesService } from './activities/activities.service';
import { ActivitiesModule } from './activities/activities.module';

export const pubSub = new RedisPubSub({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    retryStrategy: (times) => {
      // reconnect after
      return Math.min(times * 50, 2000);
    },
  },
});

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
        tokenService: TokenService,
      ) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          installSubscriptionHandlers: true,
          playground: !isProduction,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscription: {
            'graphql-ws': true,
            'subscriptions-transport-ws': true,
          },
          introspection: !isProduction,
          onConnect: (connectionParams) => {
            const token = tokenService.extractToken(connectionParams);
            if (!token) {
              throw new Error('Missing auth token!');
            }
            const user = tokenService.validateToken(token);
            if (!user) {
              throw new Error('Invalid token!');
            }
            return { user };
          },
          context: ({ req, res, connection }) => {
            if (connection) {
              return { req, res, user: connection.context.user, pubSub }; // Injecting pubSub into context
            }
            return { req, res };
          },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkspaceModule,
    RolesModule,
    StreamModule,
    ProjectModule,
    TaskModule,
    TeamModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenService,
    WorkspaceService,
    RolesService,
    StreamService,
    ProjectService,
    TaskService,
    EmailService,
    PermissionService,
    PrismaService,
    TeamService,
    TeamResolver,
    JwtService,
    ActivitiesService
  ],
})
export class AppModule {}
