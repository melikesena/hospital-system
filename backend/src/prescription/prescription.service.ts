/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription, PrescriptionDocument } from './schema/prescription.schema';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel(Prescription.name) private readonly prescriptionModel: Model<PrescriptionDocument>,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

async create(doctorId: string, appointmentId: string, medicine: string, dosage?: string) {
  const appt = await this.appointmentModel.findById(appointmentId).populate('doctor');
  if (!appt) throw new NotFoundException('Appointment not found');

  if (appt.doctor._id.toString() !== doctorId) {
    throw new ForbiddenException('You can only add prescription to your own appointment');
  }

  const prescription = new this.prescriptionModel({
    appointment: appointmentId,
    doctor: appt.doctor._id, // <- eklendi
    medicine,
    dosage,
  });

  await prescription.save();

  return this.prescriptionModel
    .findById(prescription._id)
    .populate({ path: 'appointment', populate: ['doctor', 'patient'] })
    .exec();
}



  async getByDoctor(doctorId: string) {
    return this.prescriptionModel
      .find({ doctor: doctorId })
      .populate({ path: 'appointment', populate: [{ path: 'patient' }, { path: 'doctor' }] });
  }

  async getByAppointment(appointmentId: string) {
    return this.prescriptionModel
      .find({ appointment: appointmentId })
      .populate({ 
        path: 'appointment',
        populate: [{ path: 'patient' }, { path: 'doctor' }],})
        .exec();
  }
  async getByPatient(patientId: string) {
    const appointments = await this.appointmentModel.find({ patient: patientId });
    const appointmentIds = appointments.map(appt => appt._id);
    return this.prescriptionModel
      .find({ appointment: { $in: appointmentIds } })
      .populate({ path: 'doctor' });
  }

}
