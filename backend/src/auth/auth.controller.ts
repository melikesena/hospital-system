/* eslint-disable prettier/prettier */
import { Controller, Post, Body,  UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import type { Request } from 'express';

interface JwtRequest extends Request {
  user: { userId: string; email: string; role: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
@Post('register')
async register(@Body() createUserDto: CreateUserDto): Promise<{ access_token: string }> {
  return this.authService.register(createUserDto); 
}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    return this.authService.login(loginUserDto.email, loginUserDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: JwtRequest) {
    return req.user;
  }
}
