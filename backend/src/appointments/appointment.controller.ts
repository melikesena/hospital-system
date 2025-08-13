/* eslint-disable prettier/prettier */
// appointment.controller.ts
import { Controller, Post, Get, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


interface JwtRequest extends Request {
  user: { userId: string; email: string; role: string };
}

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get('doctor/:doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getAppointmentsByDoctor(doctorId);
  }

  @Get('patient/:patientId')
  getByPatient(@Param('patientId') patientId: string) {
    return this.appointmentService.getAppointmentsByPatient(patientId);
  }

  @Patch(':id')
  updateDiagnosis(@Param('id') id: string, @Body() body: { diagnosis: string; prescription: string }) {
    return this.appointmentService.updateDiagnosisAndPrescription(id, body.diagnosis, body.prescription);
  }

   @UseGuards(JwtAuthGuard)
  @Get('patient')
  getPatientAppointments(@Req() req: JwtRequest) {
    if (req.user.role !== 'patient') {
      return { message: 'Unauthorized' };
    }
    return this.appointmentService.getAppointmentsByPatient(req.user.userId);
  }

  // Doktor kendi randevularını görebilir
  @UseGuards(JwtAuthGuard)
  @Get('doctor')
  getDoctorAppointments(@Req() req: JwtRequest) {
    if (req.user.role !== 'doctor') {
      return { message: 'Unauthorized' };
    }
    return this.appointmentService.getAppointmentsByDoctor(req.user.userId);
  }
}
