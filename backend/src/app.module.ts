/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppointmentModule } from './appointments/appointment.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { PrescriptionModule } from './prescription/prescription.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/hospital-system'), 
    AuthModule,
    UsersModule,
    AppointmentModule,
    DiagnosisModule,
    PrescriptionModule,
  ],
})
export class AppModule {}
