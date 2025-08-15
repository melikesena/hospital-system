import React, { useState } from 'react';
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';
import Navbar from '../components/Navbar';
import AppointmentList from '../components/AppointmentList';
import DiagnosisForm from '../components/DiagnosisForm';
import DiagnosisList from '../components/DiagnosisList';
import PrescriptionForm from '../components/PrescriptionForm';
import PrescriptionList from '../components/PrescriptionList';

const DoctorDashboard: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Doctor Dashboard
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardHeader title="Your Appointments" />
          <CardContent>
            <AppointmentList role="doctor" onSelect={setSelectedAppointment} />
          </CardContent>
        </Card>

        {selectedAppointment && (
          <Card sx={{ mb: 4, p: 2 }}>
            <CardHeader
              title={`Selected Appointment: ${selectedAppointment}`}
              sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}
            />
            <CardContent>
              <Grid container spacing={3}>
                {/* Sol sütun: Formlar */}
                <Grid>
                  <Stack spacing={3}>
                    <Card sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                      <Typography variant="h6" gutterBottom>
                        Add Diagnosis
                      </Typography>
                      <DiagnosisForm
                        appointmentId={selectedAppointment}
                        onSuccess={() => setSelectedAppointment(selectedAppointment)}
                      />
                    </Card>

                    <Card sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                      <Typography variant="h6" gutterBottom>
                        Add Prescription
                      </Typography>
                      <PrescriptionForm
                        appointmentId={selectedAppointment}
                        onSuccess={() => setSelectedAppointment(selectedAppointment)}
                      />
                    </Card>
                  </Stack>
                </Grid>

                {/* Sağ sütun: Listeler */}
                <Grid >
                  <Stack spacing={3}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Diagnoses
                      </Typography>
                      <DiagnosisList appointmentId={selectedAppointment} />
                    </Card>

                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Prescriptions
                      </Typography>
                      <PrescriptionList appointmentId={selectedAppointment} />
                    </Card>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default DoctorDashboard;
