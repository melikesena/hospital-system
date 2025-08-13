/* eslint-disable prettier/prettier */
// backend/src/appointments/appointment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }])],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService], // gerekiyorsa export et
})
export class AppointmentModule {} // <<< bu kesinlikle export edilmeli
