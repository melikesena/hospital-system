/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, passwordHash });
    return user.save();
  }

  async addDoctorToPatient(patientId: string, doctorId: string) {
    const patient = await this.userModel.findById(patientId);
    const doctor = await this.userModel.findById(doctorId);

    if (!patient || !doctor) throw new Error('User not found');

    if (!patient.doctors) patient.doctors = [];
    if (!doctor.patients) doctor.patients = [];

    patient.doctors.push(new Types.ObjectId(doctorId));
    doctor.patients.push(new Types.ObjectId(patientId));

    await patient.save();
    await doctor.save();
    return { patient, doctor };
  }
}
