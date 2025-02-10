import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.services';

@Module({
    providers: [PrismaService, JwtService, TeamService],
})
export class TeamModule {

}
