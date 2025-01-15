import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.services';

@Module({
  providers: [AuthResolver, AuthService, JwtService, PrismaService]
})
export class AuthModule {}
