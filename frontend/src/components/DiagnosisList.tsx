import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Diagnosis } from '../types';
import { Card, CardContent, Typography, Stack, CircularProgress } from '@mui/material';

interface Props {
  appointmentId?: string;
}

export default function DiagnosisList({ appointmentId }: Props) {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId) return setDiagnoses([]);

      setLoading(true);
      try {
        const res = await api.get<Diagnosis[]>(`/diagnosis/doctor`);
        // appointment._id ile filtreleme
        const filtered = res.data.filter(d => d.appointment && d.appointment._id === appointmentId);
        setDiagnoses(filtered);
      } catch (err) {
        console.error('Failed to fetch diagnoses', err);
        setDiagnoses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId]);

  if (loading)
    return (
      <Stack alignItems="center" sx={{ mt: 2 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 1 }}>
          Loading diagnoses...
        </Typography>
      </Stack>
    );

  if (diagnoses.length === 0)
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No diagnoses found for this appointment.
      </Typography>
    );

  return (
    <Stack spacing={2}>
      {diagnoses.map((d) => {
        const appt = d.appointment;
        const patientName = appt?.patient?.name ?? 'Unknown';
        const doctorName = appt?.doctor?.name ?? 'Unknown';
        const date = appt?.date ? new Date(appt.date).toLocaleString() : 'Unknown';

        return (
          <Card key={d._id} sx={{ p: 2, bgcolor: '#f9f9f9', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Appointment Date: {date}
              </Typography>
              <Typography variant="body1">Patient: {patientName}</Typography>
              <Typography variant="body1">Doctor: {doctorName}</Typography>
              <Typography variant="body1">Diagnosis: {d.text}</Typography>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
