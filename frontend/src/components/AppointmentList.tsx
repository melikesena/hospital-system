import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, Typography, Stack, CircularProgress } from '@mui/material';

interface Props {
  role: 'doctor' | 'patient';
  onSelect?: (appointmentId: string) => void;
}

export default function AppointmentList({ role, onSelect }: Props) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

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

  if (loading) return <CircularProgress />;

  if (appointments.length === 0)
    return <Typography>No appointments found.</Typography>;

  return (
    <Stack spacing={2}>
      {appointments.map((a) => {
        const doctorName = typeof a.doctor === 'string' ? a.doctor : a.doctor.name;
        const patientName = typeof a.patient === 'string' ? a.patient : a.patient.name;

        return (
          <Card
            key={a._id}
            variant="outlined"
            sx={{
              cursor: onSelect ? 'pointer' : 'default',
              '&:hover': { boxShadow: onSelect ? 4 : 0 },
            }}
            onClick={() => onSelect && onSelect(a._id)}
          >
            <CardContent>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1">
                  Doctor: {doctorName}
                </Typography>
                <Typography variant="subtitle1">
                  Patient: {patientName}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(a.date).toLocaleString()}
                </Typography>
                <Typography variant="body2">Status: {a.status}</Typography>
                {a.diagnosis && (
                  <Typography variant="body2">
                    Diagnosis: {a.diagnosis}
                  </Typography>
                )}
                {a.prescription && (
                  <Typography variant="body2">
                    Prescription: {a.prescription}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
