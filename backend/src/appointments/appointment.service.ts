/* eslint-disable prettier/prettier */
// appointment.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(@InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>) {}

  async create(dto: CreateAppointmentDto) {
    const appointment = new this.appointmentModel({
      doctor: dto.doctorId,
      patient: dto.patientId,
      date: dto.date,
    });
    return appointment.save();
  }

  async getAppointmentsByDoctor(doctorId: string) {
    return this.appointmentModel.find({ doctor: doctorId }).populate('patient');
  }

  async getAppointmentsByPatient(patientId: string) {
    return this.appointmentModel.find({ patient: patientId }).populate('doctor');
  }

  async updateDiagnosisAndPrescription(id: string, diagnosis: string, prescription: string) {
    return this.appointmentModel.findByIdAndUpdate(
      id,
      { diagnosis, prescription, status: 'completed' },
      { new: true }
    );
  }
}
