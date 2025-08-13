/* eslint-disable prettier/prettier */
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: ['doctor', 'patient'], required: true })
  role: 'doctor' | 'patient';

  @Prop()
  specialization?: string; // sadece doktor

  @Prop()
  age?: number; // sadece hasta

  @Prop()
  gender?: string; // sadece hasta

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  doctors?: Types.ObjectId[]; // hasta ilişkisi

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  patients?: Types.ObjectId[]; // doktor ilişkisi
}

export const UserSchema = SchemaFactory.createForClass(User);
