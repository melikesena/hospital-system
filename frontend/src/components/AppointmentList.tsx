import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Appointment } from '../types';

interface Props {
  role: 'doctor' | 'patient';
}

export default function AppointmentList({ role }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const endpoint = role === 'doctor' ? '/appointments/doctor' : '/appointments/patient';
        const res = await api.get<Appointment[]>(endpoint);

        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error('Failed to fetch appointments', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [role]);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div>
      <h3>Appointments</h3>
      {appointments.length === 0 && <p>No appointments found.</p>}
      {appointments.map(a => (
        <div key={a._id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
          <p>Doctor ID: {typeof a.doctor === 'string' ? a.doctor : a.doctor._id}</p>
          <p>Patient ID: {typeof a.patient === 'string' ? a.patient : a.patient._id}</p>
          <p>Date: {new Date(a.date).toLocaleString()}</p>
          <p>Status: {a.status}</p>
          {a.diagnosis && <p>Diagnosis: {a.diagnosis}</p>}
          {a.prescription && <p>Prescription: {a.prescription}</p>}
        </div>
      ))}
    </div>
  );
}