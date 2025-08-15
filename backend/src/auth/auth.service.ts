/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';

export interface AuthResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponse> {
  const hashed: string = await bcrypt.hash(dto.password, 10);

  const user = new this.userModel({
    name: dto.name,
    email: dto.email,
    passwordHash: hashed,
    role: dto.role,
    specialization: dto.specialization,
    age: dto.age,
    gender: dto.gender,
  });

  await user.save();

  return {
    access_token: this.jwtService.sign({
      sub: (user._id as Types.ObjectId).toHexString(),
      email: user.email,
      role: user.role,
    }),
  };
}


/*******  2ec8eee6-8e91-4831-87ec-3e4324974fdd  *******/  async login(email: string, password: string): Promise<AuthResponse> {
    const user = (await this.userModel.findOne({ email }).exec()) as UserDocument;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match: boolean = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const userId: string = (user._id as Types.ObjectId).toHexString();

    return {
      access_token: this.jwtService.sign({
        sub: userId,
        email: user.email,
        role: user.role,
        name: user.name,
      }),
    };
  }
}
