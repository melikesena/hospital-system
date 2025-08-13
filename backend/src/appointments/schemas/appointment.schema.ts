/* eslint-disable prettier/prettier */
// appointment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patient: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop()
  diagnosis?: string;

  @Prop()
  prescription?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
