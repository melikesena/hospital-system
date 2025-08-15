/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface JwtRequest {
  user: { userId: string; email: string; role: string };
}

@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: JwtRequest, @Body() body: { appointment: string; text: string }) {
    if (req.user.role !== 'doctor') {
      return { message: 'Unauthorized' };
    }
    return this.diagnosisService.create(req.user.userId, body.appointment, body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctor')
  async getDoctorDiagnoses(@Req() req: JwtRequest) {
    if (req.user.role !== 'doctor') {
      return { message: 'Unauthorized' };
    }
    return this.diagnosisService.getByDoctor(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointment/:appointmentId')
  async getByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.diagnosisService.getByAppointment(appointmentId);
}

}
