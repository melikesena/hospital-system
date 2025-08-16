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
  appointment: {
    _id: string;
    date?: string;
    doctor?: { _id: string; name: string };
    patient?: { _id: string; name: string };
  };
  doctor: string;
  text: string;
  createdAt?: string;
}

export interface Prescription {
  _id: string;
  appointment: {
    _id: string;
    date?: string;
    patient?: { name: string };
    doctor?: { name: string };
  } | string;
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
