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

const pubSub = new RedisPubSub({
  connection: {
    host:process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    retryStrategy: (times) => {
      // reconnect after
      return Math.min(times * 50, 2000);
    },
  },
});

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService, TokenService, WorkspaceService],
})
export class AppModule {}
