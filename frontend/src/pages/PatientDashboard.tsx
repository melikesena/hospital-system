import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AppointmentList from '../components/AppointmentList';
import DiagnosisList from '../components/DiagnosisList';
import PrescriptionList from '../components/PrescriptionList';
import api from '../api/axiosInstance';

const PatientDashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [doctorId, setDoctorId] = useState('');

  // Hasta randevu oluşturma
  const handleCreateAppointment = async () => {
    if (!doctorId || !appointmentDate) return alert('Fill all fields');
    try {
      await api.post('/appointments', {
        doctor: doctorId,
        patient: localStorage.getItem('userId'),
        date: appointmentDate,
      });
      alert('Appointment created!');
    } catch (err) {
      console.error(err);
      alert('Failed to create appointment');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Patient Dashboard</h2>

      {/* Randevu listesi */}
      <h3>Your Appointments</h3>
      <AppointmentList role="patient" />

      {/* Seçilen randevuya bağlı işlemler */}
      {selectedAppointment && (
        <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '20px' }}>
          <h3>Diagnoses</h3>
          <DiagnosisList appointmentId={selectedAppointment} />

          <h3>Prescriptions</h3>
          <PrescriptionList appointmentId={selectedAppointment} />
        </div>
      )}

      {/* Yeni randevu alma */}
      <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', marginTop: '20px' }}>
        <h3>Book a New Appointment</h3>
        <input
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        />
        <input
          placeholder="Date (ISO string)"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
        <button onClick={handleCreateAppointment}>Create Appointment</button>
      </div>
    </div>
  );
};

export default PatientDashboard;
