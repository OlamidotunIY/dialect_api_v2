import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

const allowedOrigins = [
  'http://localhost:3001', // Your first frontend URL
  'http://api.dialectspm.com:3500/',      // Any additional URL
  'https://dialect-frontend-lrifo.ondigitalocean.app', // Any additional URL
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,

    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],

    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints).join(
            ', ',
          );
          return accumulator;
        }, {});

        throw new BadRequestException(formattedErrors);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0').then(async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
