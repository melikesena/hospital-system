/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { Model } from 'mongoose';
import type { Request } from 'express';

interface JwtRequest extends Request {
  user: { userId: string; email: string; role: 'doctor' | 'patient' };
}

@UseGuards(JwtAuthGuard)
@Controller('prescriptions')
export class PrescriptionController {
  constructor(
    private readonly prescriptionService: PrescriptionService,
    @InjectModel(Appointment.name) private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  // Sadece doktor: kendi randevusuna reçete ekler
  @Post()
  async create(@Req() req: JwtRequest, @Body() dto: CreatePrescriptionDto) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can create prescriptions');
    }
    return this.prescriptionService.create(req.user.userId, dto.appointmentId, dto.medicine, dto.dosage);
  }

  // Doktor: kendi yazdıkları
  @Get('my')
  async myPrescriptions(@Req() req: JwtRequest) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can view their prescriptions');
    }
    return this.prescriptionService.getByDoctor(req.user.userId);
  }

  // Ortak: randevuya ait tüm reçeteler (yalnız ilgili taraflar)
  @Get('appointment/:appointmentId')
  async byAppointment(@Req() req: JwtRequest, @Param('appointmentId') appointmentId: string) {
    const appt = await this.appointmentModel.findById(appointmentId);
    if (!appt) throw new NotFoundException('Appointment not found');

    const isDoctor = req.user.role === 'doctor' && appt.doctor.toString() === req.user.userId;
    const isPatient = req.user.role === 'patient' && appt.patient.toString() === req.user.userId;
    if (!isDoctor && !isPatient) {
      throw new ForbiddenException('Not allowed to view this appointment prescriptions');
    }

    return this.prescriptionService.getByAppointment(appointmentId);
  }
}
