/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// appointment.controller.ts
import { Controller, Post, Get, Body, Param, Patch, Req, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { extname } from 'path';
import type { Express } from 'express';
import { Request } from 'express';




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

@Post(':id/upload-mri')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }),
)
async uploadMRI(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File | undefined, // file opsiyonel
) {
  if (!file) {
    throw new Error('No file uploaded');
  }

  // Tip güvenli nesne
  const mriFile: { filename: string; url: string } = {
    filename: file.originalname,
    url: `/uploads/${file.filename}`,
  };

  try {
    return await this.appointmentService.addMRI(id, mriFile);
  } catch (error) {
    // Tip güvenli dönüşüm
    const errMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'Unknown error occurred';

    console.error(errMessage);
    throw new Error(errMessage);
  }
}

}

