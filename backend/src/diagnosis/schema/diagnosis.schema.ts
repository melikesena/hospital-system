/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DiagnosisDocument = Diagnosis & Document;

@Schema({ timestamps: true })
export class Diagnosis {
  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointment: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctor: Types.ObjectId;

  @Prop({ required: true })
  text: string;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
