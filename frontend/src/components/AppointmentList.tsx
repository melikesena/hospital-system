import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';

interface Props {
  role: 'doctor' | 'patient';
  onSelect?: (appointmentId: string) => void; // Yeni prop eklendi
}

export default function AppointmentList({ role, onSelect }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth(); // login olmuş kullanıcı ID'si

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (role === 'doctor') {
          endpoint = '/appointments/doctor';
        } else if (role === 'patient' && userId) {
          endpoint = '/appointments/patient';
        } else {
          setAppointments([]);
          setLoading(false);
          return;
        }

        const res = await api.get<Appointment[]>(endpoint);
        if (Array.isArray(res.data)) setAppointments(res.data);
        else setAppointments([]);
      } catch (err) {
        console.error('Failed to fetch appointments', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [role, userId]);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div>
      <h3>Appointments</h3>
      {appointments.length === 0 && <p>No appointments found.</p>}
      {appointments.map(a => (
        <div
          key={a._id}
          style={{
            border: '1px solid #ccc',
            margin: '5px',
            padding: '5px',
            cursor: onSelect ? 'pointer' : 'default', // tıklanabilir
            backgroundColor: onSelect ? '#f9f9f9' : undefined,
          }}
          onClick={() => onSelect && onSelect(a._id)} // tıklama event
        >
          <p>Doctor: {typeof a.doctor === 'string' ? a.doctor : a.doctor.name}</p>
          <p>Patient: {typeof a.patient === 'string' ? a.patient : a.patient.name}</p>
          <p>Date: {new Date(a.date).toLocaleString()}</p>
          <p>Status: {a.status}</p>
          {a.diagnosis && <p>Diagnosis: {a.diagnosis}</p>}
          {a.prescription && <p>Prescription: {a.prescription}</p>}
        </div>
      ))}
    </div>
  );
}
