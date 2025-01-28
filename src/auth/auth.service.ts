import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma.services';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['dialect-refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException('refresh token not found');
    }
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('invalid or expired refresh token');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!userExists) {
      throw new BadRequestException('user not found');
    }

    const expiresIn = 15000;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = this.jwtService.sign(
      {
        ...payload,
        exp: expiration,
      },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );

    res.cookie('dialect-access-token', accessToken, {
      httpOnly: true,
    });

    return accessToken;
  }

  private async issueTokens(user: User, res: Response) {
    const payload = { fullname: user.fullname, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '150sec',
      },
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    res.cookie('dialect-access-token', accessToken, {
      // httpOnly: true,
      domain: '.localhost',
    });
    res.cookie('dialect-refresh-token', refreshToken, {
      // httpOnly: true,
      domain: '.localhost',
    });

    return { user, auth: { accessToken, refreshToken } };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: loginDto.email },
    });

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto, res: Response) {
    const userExists = await this.prisma.user.findFirst({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hatchedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        fullname: registerDto.fullname,
        password: hatchedPassword,
      },
    });

    return this.issueTokens(user, res);
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new BadRequestException({
        invaildCredentials: 'Invalid credentials',
      });
    }

    return this.issueTokens(user, res);
  }

  async logout(res: Response) {
    res.clearCookie('dialect-access-token');
    res.clearCookie('dialect-refresh-token');
    return { message: 'Logged out' };
  }
}
