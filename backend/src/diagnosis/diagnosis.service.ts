/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diagnosis, DiagnosisDocument } from './schema/diagnosis.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectModel(Diagnosis.name) private readonly diagnosisModel: Model<DiagnosisDocument>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(doctorId: string, appointmentId: string, text: string) {
    // Appointment var mı kontrol et
    const appt = await this.appointmentModel.findById(appointmentId);
    if (!appt) throw new NotFoundException('Appointment not found');

    // Yalnızca randevunun doktoru ekleyebilir
    if (appt.doctor.toString() !== doctorId) {
      throw new ForbiddenException('You can only add diagnosis to your own appointment');
    }

    // Yeni diagnosis yarat
    const diagnosis = new this.diagnosisModel({
      appointment: appt._id,
      doctor: doctorId,
      text,
    });

    await diagnosis.save();

    // Kaydettikten sonra populate ile geri döndür
    return this.diagnosisModel
      .findById(diagnosis._id)
      .populate({ path: 'appointment', populate: [{ path: 'doctor' }, { path: 'patient' }] })
      .exec();
  }

  async getByDoctor(doctorId: string) {
    return this.diagnosisModel
      .find({ doctor: doctorId })
      .populate({ path: 'appointment', populate: [{ path: 'patient' }, { path: 'doctor' }] })
      .exec();
  }

  async getByAppointment(appointmentId: string) {
    return this.diagnosisModel
      .find({ appointment: appointmentId })
      .populate({ path: 'appointment', populate: [{ path: 'doctor' }, { path: 'patient' }] })
      .exec();
  }
}
