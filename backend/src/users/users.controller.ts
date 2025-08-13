/* eslint-disable prettier/prettier */
// user.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Post(':patientId/add-doctor/:doctorId')
  addDoctorToPatient(@Param('patientId') patientId: string, @Param('doctorId') doctorId: string) {
    return this.userService.addDoctorToPatient(patientId, doctorId);
  }
}
