import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { Prescription } from '../types';
import { Card, CardContent, Typography, Stack, CircularProgress } from '@mui/material';

interface Props {
  appointmentId?: string;
}

export default function PrescriptionList({ appointmentId }: Props) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = appointmentId ? `/prescriptions/appointment/${appointmentId}` : '/prescriptions/my';
        const res = await api.get<Prescription[]>(url);
        setPrescriptions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch prescriptions', err);
        setPrescriptions([]);
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
          Loading prescriptions...
        </Typography>
      </Stack>
    );

  if (prescriptions.length === 0)
    return (
      <Typography variant="body1" sx={{ mt: 2 }}>
        No prescriptions found.
      </Typography>
    );

  return (
    <Stack spacing={2}>
      {prescriptions.map((p) => {
        const appt = typeof p.appointment === 'object' ? p.appointment : null;
        const patientName = appt?.patient?.name ?? 'Unknown';
        const doctorName = appt?.doctor?.name ?? 'Unknown';
        const date = appt?.date ?? 'Unknown';

        return (
          <Card key={p._id} sx={{ p: 2, bgcolor: '#f9f9f9', boxShadow: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Appointment Date: {date}
              </Typography>
              <Typography variant="body1">Patient: {patientName}</Typography>
              <Typography variant="body1">Doctor: {doctorName}</Typography>
              <Typography variant="body1">Medicine: {p.medicine}</Typography>
              <Typography variant="body1">Dosage: {p.dosage || 'N/A'}</Typography>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
