import React, { useState, useEffect } from 'react'; 
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import Navbar from '../components/Navbar';
import AppointmentList from '../components/AppointmentList';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

type Doctor = {
  _id: string;
  name: string;
};

type Prescription = {
  _id: string;
  appointment: string;
  doctor: Doctor | string;
  medicine: string;
  dosage: string;
  createdAt: string;
};

const PatientDashboard: React.FC = () => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
  const { name: patientName, userId } = useAuth();

  useEffect(() => {
    api.get<Doctor[]>('/users/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error('Doktor listesi alınamadı', err));
  }, []);

  useEffect(() => {
    const today = new Date();
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i + 1);
      dates.push(d.toISOString().split('T')[0]);
    }
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchPrescriptions = async () => {
      setLoadingPrescriptions(true);
      try {
        const res = await api.get<Prescription[]>(`/prescriptions/patient/${userId}`);
        setPrescriptions(res.data);
      } catch (err) {
        console.error('Failed to fetch prescriptions', err);
        setPrescriptions([]);
      } finally {
        setLoadingPrescriptions(false);
      }
    };
    fetchPrescriptions();
  }, [userId]);

  const handleCreateAppointment = async () => {
    if (!doctorId || !appointmentDate) return alert('Lütfen tüm alanları doldurun');
    if (!userId) return alert('Patient ID bulunamadı');

    try {
      await api.post('/appointments', {
        doctorId,
        patientId: userId,
        date: new Date(appointmentDate),
      });

      await api.post(`/users/${userId}/add-doctor/${doctorId}`);
      alert('Randevu oluşturuldu!');
      setDoctorId('');
      setAppointmentDate('');
    } catch (err) {
      console.error(err);
      alert('Randevu oluşturulamadı');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoş geldin, {patientName}
        </Typography>

        {/* Randevular */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Randevularım
            </Typography>
            <AppointmentList role="patient" />
          </CardContent>
        </Card>

        {/* Reçeteler */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Reçetelerim
            </Typography>
            {loadingPrescriptions ? (
              <CircularProgress />
            ) : prescriptions.length === 0 ? (
              <Typography>Henüz reçeteniz yok.</Typography>
            ) : (
              <Stack spacing={2}>
                {prescriptions.map((p) => (
                  <Card key={p._id} variant="outlined">
                    <CardContent>
                      <Typography>Doktor: {typeof p.doctor === 'string' ? p.doctor : p.doctor.name}</Typography>
                      <Typography>İlaç: {p.medicine}</Typography>
                      <Typography>Dozaj: {p.dosage}</Typography>
                      <Typography>Tarih: {new Date(p.createdAt).toLocaleString()}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Yeni Randevu */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Yeni Randevu Al
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Doktor Seç</InputLabel>
                <Select value={doctorId} label="Doktor Seç" onChange={(e) => setDoctorId(e.target.value)}>
                  {doctors.map((doc) => (
                    <MenuItem key={doc._id} value={doc._id}>{doc.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Tarih Seç</InputLabel>
                <Select value={appointmentDate} label="Select a Date" onChange={(e) => setAppointmentDate(e.target.value)}>
                  {availableDates.map((date) => (
                    <MenuItem key={date} value={date}>{date}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" onClick={handleCreateAppointment}>
                Randevu Oluştur
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default PatientDashboard;
