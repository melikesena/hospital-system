/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Prescription, PrescriptionDocument } from './schema/prescription.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Prescription.name) private readonly prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(doctorId: string, appointmentId: string, medicine: string, dosage?: string) {
    const appt = await this.appointmentModel.findById(appointmentId);
    if (!appt) throw new NotFoundException('Appointment not found');

    if (appt.doctor.toString() !== doctorId) {
      throw new ForbiddenException('You can only add prescription to your own appointment');
    }

    const presc = new this.prescriptionModel({
      appointment: new Types.ObjectId(appointmentId),
      doctor: new Types.ObjectId(doctorId),
      medicine,
      dosage,
    });
    return presc.save();
  }

  async getByDoctor(doctorId: string) {
    return this.prescriptionModel
      .find({ doctor: doctorId })
      .populate({ path: 'appointment', populate: [{ path: 'patient' }, { path: 'doctor' }] });
  }

  async getByAppointment(appointmentId: string) {
    return this.prescriptionModel
      .find({ appointment: appointmentId })
      .populate({ path: 'doctor' });
  }
}
