export interface Appointment {
  _id: string;
  doctor: string | { _id: string; name: string }; // doctorId
  patient: string | { _id: string; name: string }; // patientId
  date: string;
  time?: string;
  status: string;
  diagnosis?: string;
  prescription?: string;
}
export interface Diagnosis {
  _id: string;
  appointment: string | { _id: string }; // appointmentId
  text: string;
  doctor: string;
}
export interface Prescription {
  _id: string;
  appointment: string | { _id: string }; // appointmentId
  doctor: string;
  medicine: string;
  dosage: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface User {
  _id: string;
  name: string;
  passwordHash?: string; // Password should not be returned in responses
  role: 'doctor' | 'patient';
  email: string;
  age?: number;
  gender?: string;
  specialization?: string;
  createdAt?: string;
  updatedAt?: string;
}
